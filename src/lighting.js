import {CellGrid, Cell} from 'utils/cell_grid';
import {VisionCellList} from 'vision';
import {detectVisibleArea, detectVisibleAreaConstrained} from 'shadowcast';
import {Vec3} from 'utils/vec3.js';
import {normalize} from 'utils/angle';
import {UINT32_MAX} from 'utils/limits';

export const ALL_CHANNELS = UINT32_MAX;

const LIGHT_DISTANCE = 100;

const SURFACE_NORMAL = new Vec3(0, 0, 1);

const WORKING_VEC3 = new Vec3(0, 0, 0);

class LightDescription {
    constructor(light, cell) {
        this.light = light;
        this.cell = cell;
        this.intensity = 0;
        this.sequence = 0;
        this.sides = new Array(4);
    }

    getIntensity(point) {
        this.light.vector.subtractInPlace(point, WORKING_VEC3);
        WORKING_VEC3.normalizeInPlace(WORKING_VEC3);
        let dot = SURFACE_NORMAL.dot(WORKING_VEC3);
        return dot * this.light.intensity;
    }

    update(intensity, sides) {
        this.intensity = intensity * this.getIntensity(this.cell.lightingCentre);
        this.sequence = this.light.sequence;
        for (let i = 0; i < this.sides.length; ++i) {
            this.sides[i] = sides[i];
        }
    }
}

/* Provides the grid interfaces required by the vision system after
 * applying light masks */
class MaskedSpacialHash {
    constructor(light, channels) {
        this.light = light;
        this.channels = channels;
    }

    get spacialHash() {
        return this.light.lightContext.ecsContext.spacialHash;
    }

    get limits() {
        return this.spacialHash.limits;
    }

    get(coord) {
        return this.spacialHash.get(coord);
    }
}

/* Provides the vision cell list interface required by vision system,
 * trapping access to masked cells so their visibility isn't affected
 * despite what the vision system thinks */
class MaskedVisionCellList {
    constructor(light, channels) {
        this.light = light;
        this.channels = channels;
    }

    get visionCellList() {
        return this.light.lightContext.visionCells;
    }

    addAllSides(coord, visibility) {
        this.visionCellList.addAllSides(coord, visibility);
    }

    getDescription(coord) {
        return this.visionCellList.getDescription(coord);
    }
}

let nextLightId = 0;

export class Light {
    constructor(coord, intensity, height, channels = ALL_CHANNELS) {

        this.id = nextLightId;
        ++nextLightId;

        this.coord = coord;
        this.intensity = intensity;
        this._height = height;

        this.vector = new Vec3(coord.x + 0.5, coord.y + 0.5, height);
        this.lightContext = null;

        this.sequence = 0;

        this.maskedSpacialHash = new MaskedSpacialHash(this, channels);
        this.maskedVisionCellList = new MaskedVisionCellList(this, channels);
    }

    set height(value) {
        this._height = value;
        this.vector.z = value;
    }

    get height() {
        return this._height;
    }

    setCoord(coord) {
        this.coord.set(coord);
        this.vector.x = coord.x + 0.5;
        this.vector.y = coord.y + 0.5;
    }

    detectVisibleArea() {
        detectVisibleArea(this.coord, LIGHT_DISTANCE, this.maskedSpacialHash,
                this.maskedVisionCellList);
    }

    updateLitCells() {
        ++this.sequence;

        this.lightContext.visionCells.clear();
        this.detectVisibleArea();

        for (let description of this.lightContext.visionCells) {
            let lightCell = this.lightContext.grid.get(description.cell);
            lightCell.updateLight(this, description.visibility, description.sides);
        }
    }
}

export class DirectionalLight extends Light {
    constructor(coord, intensity, height, angle, width, channels = ALL_CHANNELS) {
        super(coord, intensity, height, channels);
        this.angle = angle;
        this.width = width;
    }

    detectVisibleArea() {
        let halfWidth = this.width / 2;
        let startAngle = normalize(this.angle - halfWidth);
        let endAngle = normalize(this.angle + halfWidth);
        detectVisibleAreaConstrained(this.coord, LIGHT_DISTANCE, this.lightContext.ecsContext.spacialHash,
                this.lightContext.visionCells, startAngle, endAngle);
    }
}

class LightCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.lightingCentre = new Vec3(this.centre.x, this.centre.y, 0);
        this.lights = new Map();
        this.sides = new Array(4);
        this.intensity = 0;
        this.clearSides();
    }

    clearSides() {
        for (let i = 0; i < this.sides.length; ++i) {
            this.sides[i] = 0;
        }
    }

    updateLight(light, intensity, sides) {
        let description;
        if (this.lights.has(light)) {
            description = this.lights.get(light);
        } else {
            description = new LightDescription(light, this);
            this.lights.set(light, description);
        }

        description.update(intensity, sides);
        this.updateTotals();
    }

    updateTotals() {
        this.intensity = 0;
        this.clearSides();

        for (let description of this.lights.values()) {
            if (description.light.sequence == description.sequence) {
                this.intensity += description.intensity;

                for (let i = 0; i < this.sides.length; ++i) {
                    if (description.sides[i]) {
                        this.sides[i] += description.intensity;
                    }
                }
            }
        }

    }
}

class LightGrid extends CellGrid(LightCell) {
    constructor(width, height) {
        super(width, height);
    }
}

export class LightContext {
    constructor(ecsContext) {
        this.lights = new Set();
        this.ecsContext = ecsContext;
        this.grid = new LightGrid(ecsContext.width, ecsContext.height);
        this.visionCells = new VisionCellList(ecsContext);
    }
}
