import {CellGrid, Cell} from 'utils/cell_grid';
import {SearchPriorityQueue} from 'utils/search_priority_queue';
import {Directions} from 'utils/direction';
import {Tiles} from 'tiles';
import {BestSet} from 'utils/best_set';

export class DijkstraCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.value = 0;
        this.seen = false;
        this.visited = false;
    }

    isEnterable() {
        return true;
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

export function DijkstraMap(T) {
    return class DijkstraMapInstance extends CellGrid(T) {
        constructor(width, height) {
            super(width, height);
            this.queue = new SearchPriorityQueue((a, b) => {return b.value - a.value});
            this.bestNeighbour = new BestSet(compareMoveCost, 8); // 8 directions
        }

        debugDraw(drawer) {
            for (let cell of this) {
                if (cell.visited) {
                    drawer.drawTileUnstored(Tiles.getDebug(
                        Math.floor(cell.value)), cell.x, cell.y);
                }
            }
        }

        clear() {
            for (let cell of this) {
                cell.visited = false;
                cell.seen = false;
            }
        }

        computeFromZeroCoord(coord) {
            this.queue.clear();
            this.queue.insert(this.get(coord));
            this.compute();
        }

        computeFromZeroCoords(coords) {
            this.queue.clear();
            for (let coord of coords) {
                this.queue.insert(this.get(coord));
            }
            this.compute();
        }

        compute() {
            this.clear();
            for (let cell of this.queue) {
                cell.value = 0;
                cell.seen = true;
            }
            while (!this.queue.empty) {
                let cell = this.queue.remove();

                if (cell.visited) {
                    continue;
                }

                cell.visited = true;

                for (let direction of Directions) {
                    let neighbour = cell.getNeighbour(direction);
                    if (neighbour === null) {
                        continue;
                    }
                    if (neighbour.visited) {
                        continue;
                    }
                    if (!neighbour.isEnterable(cell)) {
                        continue;
                    }

                    let value = cell.value + direction.multiplier;
                    if (!neighbour.seen || value < neighbour.value) {
                        neighbour.seen = true;
                        neighbour.value = value;
                        this.queue.insert(neighbour);
                    }
                }
            }
        }
    }
}
