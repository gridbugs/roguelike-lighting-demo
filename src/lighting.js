import {CellGrid, Cell} from 'utils/cell_grid';
import {VisionCellList} from 'vision';
import {detectVisibleArea, detectVisibleAreaConstrained} from 'shadowcast';
import {Vec3} from 'utils/vec3.js';
import {normalize} from 'utils/angle';
import {UINT32_MAX} from 'utils/limits';
import {Components} from 'components';
import {ObjectPool} from 'utils/object_pool';
import {Direction} from 'utils/direction';
import {createCanvasContext} from 'utils/canvas';
import {Config} from 'config';
import {constrain} from 'utils/arith';

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
        this.sides = new Array(Direction.length);
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

class TransparentCell {
    constructor() {
        this.cell = null;
    }

    get opacity() {
        return 0;
    }

    get x() {
        return this.cell.x;
    }

    get y() {
        return this.cell.y;
    }

    get coord() {
        return this.cell.coord;
    }

    get centre() {
        return this.cell.centre;
    }

    get corners() {
        return this.cell.corners;
    }
}

/* Provides the grid interfaces required by the vision system after
 * applying light masks */
class MaskedSpacialHash {
    constructor(light, channels) {
        this.light = light;
        this.channels = channels;
        this.transparentCellPool = new ObjectPool(TransparentCell);
    }

    get spacialHash() {
        return this.light.lightContext.ecsContext.spacialHash;
    }

    get limits() {
        return this.spacialHash.limits;
    }

    get(coord) {
        let cell = this.spacialHash.get(coord);
        if (cell.entities.hasComponent(Components.LightMask)) {
            let entity = cell.find(Components.LightMask);
            let mask = entity.get(Components.LightMask).mask;
            if (!(this.channels & mask)) {
                let transparentCell = this.transparentCellPool.allocate();
                transparentCell.cell = cell;
                return transparentCell;
            }
        }
        return cell;
    }
}

class DummyDescription {
    constructor() {
        this.visibility = 0;
    }

    setSide(side, value) {
        // do nothing
    }

    setAllSides(value) {
        // do nothing
    }
}

/* Provides the vision cell list interface required by vision system,
 * trapping access to masked cells so their visibility isn't affected
 * despite what the vision system thinks */
class MaskedVisionCellList {
    constructor(light, channels) {
        this.light = light;
        this.channels = channels;
        this.dummyDescription = new DummyDescription();
    }

    get spacialHash() {
        return this.light.lightContext.ecsContext.spacialHash;
    }

    get visionCellList() {
        return this.light.lightContext.visionCells;
    }

    isValidCoord(coord) {
        let cell = this.spacialHash.get(coord);
        if (cell.entities.hasComponent(Components.LightMask)) {
            let entity = cell.find(Components.LightMask);
            let mask = entity.get(Components.LightMask).mask;
            if (!(this.channels & mask)) {
                return false;
            }
        }
        return true;
    }

    addAllSides(coord, visibility) {
        if (this.isValidCoord(coord)) {
            this.visionCellList.addAllSides(coord, visibility);
        }
    }

    getDescription(coord) {
        if (this.isValidCoord(coord)) {
            return this.visionCellList.getDescription(coord);
        } else {
            return this.dummyDescription;
        }
    }
}

let nextLightId = 0;

export class Light {
    constructor(coord, intensity, height, channels = ALL_CHANNELS, colourTile = null) {

        this.id = nextLightId;
        ++nextLightId;

        this.coord = coord;
        this.intensity = intensity;
        this._height = height;

        this.vector = new Vec3(coord.x + 0.5, coord.y + 0.5, height);
        this.lightContext = null;

        this.sequence = 0;

        this.channels = channels;
        this.colourTile = colourTile;

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
        this.maskedSpacialHash.transparentCellPool.flush();
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

    remove() {
        this.lightContext.remove(this);
    }
}

export class DirectionalLight extends Light {
    constructor(coord, intensity, height, angle, width, channels = ALL_CHANNELS, colourTile = null) {
        super(coord, intensity, height, channels, colourTile);
        this.angle = angle;
        this.width = width;
    }

    detectVisibleArea() {
        let halfWidth = this.width / 2;
        let startAngle = normalize(this.angle - halfWidth);
        let endAngle = normalize(this.angle + halfWidth);
        detectVisibleAreaConstrained(this.coord, LIGHT_DISTANCE, this.maskedSpacialHash,
                this.maskedVisionCellList, startAngle, endAngle);
    }
}

class LightCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.lightingCentre = new Vec3(this.centre.x, this.centre.y, 0);
        this.lights = new Map();
        this.sides = new Array(Direction.length);
        this.intensity = 0;
        this.clearSides();

        /* Light colour framebuffer info */
        this.xOffset = x * Config.TILE_WIDTH;
        this.yOffset = y * Config.TILE_HEIGHT;
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
        this.grid.clearBufferCell(this.x, this.y);

        for (let description of this.lights.values()) {
            let light = description.light;

            if (light.sequence == description.sequence) {
                this.intensity += description.intensity;

                for (let i = 0; i < this.sides.length; ++i) {
                    if (description.sides[i]) {
                        this.sides[i] += description.intensity;
                    }
                }

                if (light.colourTile != null) {

                    let index = Math.floor(constrain(0, description.intensity,
                        light.colourTile.transparencyLevels.length - 1));

                    let sprite = light.colourTile.transparencyLevels[index];

                    this.grid.ctx.drawImage(
                        sprite.tileStore.canvas,
                        sprite.x, sprite.y,
                        sprite.width, sprite.height,
                        this.xOffset, this.yOffset,
                        Config.TILE_WIDTH, Config.TILE_HEIGHT
                    );
                }
            }
        }
    }

    remove(light) {
        this.lights.delete(light);
    }
}

class LightGrid extends CellGrid(LightCell) {
    constructor(width, height) {
        super(width, height);
        this.ctx = createCanvasContext(width * Config.TILE_WIDTH, height * Config.TILE_HEIGHT);
        this.canvas = this.ctx.canvas;
        this.ctx.globalCompositeOperation = 'lighter';

        $('#canvas').after(this.canvas);
        this.canvas.style.backgroundColor = 'white';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '800px';
        this.canvas.style.left = '1200px';
    }

    clearBufferCell(x, y) {
        this.ctx.clearRect(x * Config.TILE_WIDTH, y * Config.TILE_HEIGHT, Config.TILE_WIDTH, Config.TILE_HEIGHT);
    }
}

export class LightContext {
    constructor(ecsContext) {
        this.lights = new Set();
        this.ecsContext = ecsContext;
        this.grid = new LightGrid(ecsContext.width, ecsContext.height);
        this.visionCells = new VisionCellList(ecsContext);
    }

    remove(light) {
        this.lights.delete(light);
        for (let cell of this.grid) {
            cell.remove(light);
        }
    }
}
