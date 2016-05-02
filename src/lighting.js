import {CellGrid, Cell} from 'utils/cell_grid';
import {VisionCellList} from 'vision';
import {Vec3} from 'utils/vec3.js';

export class Light {
    constructor(coord, intensity, height) {
        this.coord = coord;
        this.intensity = intensity;
        this.height = height;

        this.vector = new Vec3(coord.x, coord.y, height);
        this.lightContext = null;
    }
}

class LightCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
    }
}

class LightGrid extends CellGrid(LightCell) {
    constructor(width, height) {
        super(width, height);
    }
}

export class LightContext {
    constructor(ecsContext) {
        this.ecsContext = ecsContext;
        this.grid = new LightGrid(ecsContext.width, ecsContext.height);
    }
}
