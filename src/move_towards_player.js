import {Config} from './config.js';
import {GlobalDrawer} from './global_drawer.js';
import {Tiles} from './tiles.js';

import {Controller} from './controller.js';

import {Components} from './components.js';
import {Actions} from './actions.js';

import {BestSet} from './best_set.js';
import {Directions} from './direction.js';

import {DijkstraMap, DijkstraCell} from './dijkstra_map.js';

class MoveCell extends DijkstraCell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.transferCost = 0;
        this.direction = null;
    }

    get enterable() {
        let knowledgeCell = this.getKnowledgeCell();
        if (!knowledgeCell.known) {
            return false;
        }
        if (knowledgeCell.is(Components.Solid)) {
            return false;
        }
        return true;
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
            neighbour.totalCost = neighbour.value + direction.multiplier;
            best.insert(neighbour);
        }
        return best;
    }

    debugDraw() {
        this.grid.controller.debugDrawer.drawTileUnstored(Tiles.getDebug(
                    Math.floor(this.value)), this.x, this.y);
    }
}

function compareMoveCost(a, b) {
    if (a.visited && b.visited) {
        return b.totalCost - a.totalCost;
    }
    if (a.visited) {
        return 1;
    }
    if (b.visited) {
        return -1;
    }
    return 0;
}

class MoveMap extends DijkstraMap(MoveCell) {
    constructor(width, height, controller) {
        super(width, height);
        this.controller = controller;
        this.bestNeighbour = new BestSet(compareMoveCost, 8); // 8 directions
    }
}

export class MoveTowardsPlayer extends Controller {
    constructor() {
        super();
        if (Config.DEBUG) {
            this.debugDrawer = GlobalDrawer.Drawer;
        }
        this.targetMap = new MoveMap(Config.GRID_WIDTH, Config.GRID_HEIGHT, this);
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
