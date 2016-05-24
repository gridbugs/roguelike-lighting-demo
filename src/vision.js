import {ObjectPool} from 'utils/object_pool';
import {Cell, CellGrid} from 'utils/cell_grid';
import {Direction} from 'utils/direction';

class VisionCellDescription {
    constructor() {
        this.cell = null;
        this.visibility = 0;
        this.sides = new Array(Direction.length);
        this.setAllSides(false);
    }

    setAllSides(value) {
        for (let i = 0; i < this.sides.length; ++i) {
            this.sides[i] = value;
        }
    }

    clear() {
        this.visibility = 0;
        this.setAllSides(false);
    }

    setSide(direction, value) {
        this.sides[direction.index] = value;
    }
}

class VisionCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.last = -1;
        this.description = null;
    }
}

class VisionGrid extends CellGrid(VisionCell) {}

export class VisionCellList {
    constructor(ecsContext) {
        this.size = ecsContext.width * ecsContext.height;
        this.pool = new ObjectPool(VisionCellDescription, this.size);
        this.seen = new VisionGrid(ecsContext.width, ecsContext.height);
        this.current = 0;
    }

    get length() {
        return this.pool.index;
    }

    get array() {
        return this.pool.array;
    }

    *[Symbol.iterator]() {
        yield* this.pool;
    }

    clear() {
        ++this.current;
        this.pool.flush();
    }

    getDescription(coord) {
        let cell = this.seen.get(coord);
        if (cell.last != this.current) {
            cell.last = this.current;
            let description = this.allocateDescription(cell);
            description.clear();
        }
        return cell.description;
    }

    allocateDescription(cell) {
        let description = this.pool.allocate();
        description.cell = cell;
        cell.description = description;
        return description;
    }

    addAllSides(coord, visibility) {
        let description = this.getDescription(coord);
        description.setAllSides(true);
        description.visibility = visibility;
    }
}
