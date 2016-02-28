import {CellGrid, Cell} from './cell_grid.js';
import {SearchPriorityQueue} from './search_priority_queue.js';
import {Directions} from './direction.js';

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
}

export function DijkstraMap(T) {
    return class DijkstraMapInstance extends CellGrid(T) {
        constructor(width, height) {
            super(width, height);
            this.queue = new SearchPriorityQueue((a, b) => {return b.value - a.value});
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
            this.queue.populate(coords);
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
                    if (!neighbour.isEnterable()) {
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
