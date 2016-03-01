import {DijkstraMap, DijkstraCell} from 'utils/dijkstra_map.js';
import {Stack} from 'utils/stack.js';

const PADDING = 10;

class ShadowCell extends DijkstraCell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.reference = null;
    }

    isEnterable() {
        return this.reference.visited;
    }
}

class ShadowMap extends DijkstraMap(ShadowCell) {
    constructor(width, height, reference) {
        super(width, height);
        for (let cell of this) {
            cell.reference = reference.get(cell.coord);
        }
    }
}

export class SafetyCell extends DijkstraCell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this._visited = false;
    }

    isEnterable(fromCell) {
        return fromCell.value < this.grid.threshold;
    }

    get visited() {
        return this._visited;
    }

    set visited(value) {
        this._visited = value;
        if (value) {
            this.grid.cells.push(this);
            if (this.value >= this.grid.threshold) {
                this.grid.frontier.push(this.coord);
            }
        }
    }
}

export function SafetyMap(T) {
    return class SafetyMapInstance extends DijkstraMap(T) {
        constructor(width, height, threshold, delay) {
            super(width, height);
            this.threshold = threshold;
            this.delay = delay;
            this.frontier = new Stack();
            this.cells = new Stack();
            this.shadow = new ShadowMap(width, height, this);
        }

        computeFromCoord(coord) {
            this.cells.clear();
            this.queue.clear();
            this.frontier.clear();
            this.queue.insert(this.get(coord));
            this.compute();
            this.shadow.computeFromZeroCoords(this.frontier);
            for (let cell of this.cells) {
                cell.value = PADDING + this.threshold - cell.value + this.shadow.get(cell.coord).value * this.delay;
            }
        }
    }
}
