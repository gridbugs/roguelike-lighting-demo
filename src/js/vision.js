import {ObjectPool} from 'utils/object_pool';
import {Cell, CellGrid} from 'utils/cell_grid';

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
