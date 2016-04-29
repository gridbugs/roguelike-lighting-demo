import {ObjectPool} from 'utils/object_pool';
import {Cell, CellGrid} from 'utils/cell_grid';

export const MAX_OPACITY = 0xffffffff;
export const MIN_OPACITY = 0;
export const MAX_VISIBILITY = MAX_OPACITY;
export const MIN_VISIBILITY = MIN_OPACITY;

export function opacityFromFloat(f) {
    return Math.floor(f * MAX_OPACITY);
}

class VisionCellDescription {
    constructor() {
        this.cell = null;
        this.visibility = 0;
    }
}

class VisionCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.last = -1;
    }
}

class VisionGrid extends CellGrid(VisionCell) {}

export class VisionCellList {
    constructor(width, height) {
        this.size = width * height;
        this.pool = new ObjectPool(VisionCellDescription, this.size);
        this.seen = new VisionGrid(width, height);
        this.current = 0;
    }

    get length() {
        return this.pool.index;
    }

    get array() {
        return this.pool.array;
    }

    clear() {
        ++this.current;
        this.pool.flush();
    }

    add(cell, visibility) {
        let visionCell = this.seen.get(cell);
        if (visionCell === null) {
            return; // TODO disconnect the dimensions of the screen from the dimensions of this grid
        }
        if (visionCell.last !== this.current) {
            visionCell.last = this.current;
            this._add(cell, visibility);
        }
    }

    _add(cell, visibility) {
        let desc = this.pool.allocate();
        desc.cell = cell;
        desc.visibility = visibility;
    }
}
