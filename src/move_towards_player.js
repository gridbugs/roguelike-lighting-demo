import {Config} from './config.js';
import {GlobalDrawer} from './global_drawer.js';
import {Tiles} from './tiles.js';

import {Controller} from './controller.js';
import {Turn} from './turn.js';

import {Components} from './components.js';
import {Actions} from './actions.js';

import {CellGrid, Cell} from './cell_grid.js';
import {SearchQueue} from './search_queue.js';
import {BestSet} from './best_set.js';
import {Directions} from './direction.js';

class DijkstraMapCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.value = 0;
        this.visited = false;
        this.direction = null;
    }

    getKnowledgeCell() {
        return this.grid.controller.getKnowledgeGrid().get(this.coord);
    }

    getLowestNeighbours() {
        let best = this.grid.bestNeighbour;
        best.clear();
        for (let direction of Directions) {
            let neighbour = this.getNeighbour(direction);
            neighbour.direction = direction;
            best.insert(neighbour);
        }
        return best;
    }
}

DijkstraMapCell.compare = function(a, b) {
    if (a.visited && b.visited) {
        return b.value - a.value;
    }
    if (a.visited) {
        return 1;
    }
    if (b.visited) {
        return -1;
    }
    return 0;
}

class DijkstraMap extends CellGrid(DijkstraMapCell) {
    constructor(width, height, controller) {
        super(width, height);
        this.controller = controller;
        this.queue = new SearchQueue();
        this.bestNeighbour = new BestSet(DijkstraMapCell.compare, 8); // 8 directions
    }

    clear() {
        for (let cell of this) {
            cell.visited = false;
        }
    }

    computeFromZeroCoord(coord) {
        this.queue.clear();
        this.queue.push(this.get(coord));
        this.compute();
    }

    computeFromZeroCoords(coords) {
        this.queue.clear();
        for (let coord of coords) {
            this.queue.push(this.get(coord));
        }
        this.compute();
    }

    compute() {
        this.clear();
        for (let cell of this.queue) {
            cell.value = 0;
            cell.visited = true;
        }
        while (!this.queue.empty) {
            let cell = this.queue.shift();
            let knowledgeCell = cell.getKnowledgeCell();
            this.controller.debugDrawer.drawTileUnstored(Tiles.getDebug(cell.value), cell.x, cell.y);
            for (let neighbour of cell.neighbours) {
                if (!neighbour.visited) {
                    let knowledgeCell = neighbour.getKnowledgeCell();
                    if (knowledgeCell.is(Components.Solid)) {
                        continue;
                    }
                    if (!knowledgeCell.known) {
                        continue;
                    }
                    neighbour.value = cell.value + 1;
                    neighbour.visited = true;
                    this.queue.push(neighbour);
                }
            }
        }
    }
}

export class MoveTowardsPlayer extends Controller {
    constructor() {
        super();
        if (Config.DEBUG) {
            this.debugDrawer = GlobalDrawer.Drawer;
        }
        this.targetMap = new DijkstraMap(Config.GRID_WIDTH, Config.GRID_HEIGHT, this);
        this.lastKnownPosition = null;
    }

    getKnowledgeGrid() {
        return this.entity.get(Components.Observer).knowledge.getGrid(this.ecsContext);
    }

    get ecsContext() {
        return this.entity.ecsContext;
    }

    getPlayerCell() {
        let grid = this.getKnowledgeGrid();
        for (let cell of grid) {
            if (cell.has(Components.PlayerCharacter)) {
                return cell;
            }
        }

        return null;
    }

    getAction() {
        let playerCell = this.getPlayerCell();
        if (playerCell === null) {
            if (this.lastKnownPosition === null) {
                return new Actions.Wait(this.entity);
            } else {
                playerCell = this.lastKnownPosition;
            }
        } else {
            this.lastKnownPosition = playerCell;
        }
        this.targetMap.clear();
        this.targetMap.computeFromZeroCoord(playerCell.coord);
        let candidates = this.targetMap.get(this.entity.cell.coord).getLowestNeighbours();
        let direction = candidates.getRandom().direction;
        return new Actions.Walk(this.entity, direction);
    }
}
