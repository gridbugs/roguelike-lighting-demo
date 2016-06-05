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
import {ArrayCollection} from 'utils/array_collection';
import {rgba32TransparentiseRatio, rgba32Add, TRANSPARENT} from 'utils/rgba32';

export const ALL_CHANNELS = UINT32_MAX;

export const NO_COLOUR = TRANSPARENT;

const LIGHT_DISTANCE = 100;
const MAX_NUM_LIGHTS = 100;

const SURFACE_NORMAL = new Vec3(0, 0, 1);

const WORKING_VEC3 = new Vec3(0, 0, 0);

/* A guess at the maximum number of colour sprites per cell.
 * Used as a hint to optimize storage of colour sprites in cells. */
const MAX_NUM_TILE_COLOURS_ESTIMATE = 10;

class LightProfile {
    constructor(light, cell) {
        this.light = light;
        this.cell = cell;
        this.intensity = 0;
        this.sequence = 0;
        this.sides = new Array(Direction.length);

        /* This flag indicates whether the cell that owns this profile
         * is currently tracking the light described by the profile.
         */
        this.tracked = false;
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
        for (let i = 0; i < this.sides.length; i++) {
            this.sides[i] = sides[i];
        }
    }

    get valid() {
        return this.sequence == this.light.sequence;
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
        return this.light.visionCellList;
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
    constructor(coord, intensity, height, channels = ALL_CHANNELS, colour = NO_COLOUR) {

        this.id = nextLightId;
        nextLightId++;

        this.coord = coord;
        this.intensity = intensity;
        this._height = height;

        this.vector = new Vec3(coord.x + 0.5, coord.y + 0.5, height);
        this.lightContext = null;

        this.sequence = 0;

        this.channels = channels;
        this.colour = colour;

        this.maskedSpacialHash = new MaskedSpacialHash(this, channels);
        this.maskedVisionCellList = new MaskedVisionCellList(this, channels);
    }

    get visionCellList() {
        return this.lightContext.visionCells;
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
        this.sequence++;

        this.visionCellList.clear();
        this.detectVisibleArea();
        for (let description of this.visionCellList) {
            let lightCell = this.lightContext.grid.get(description.cell);
            lightCell.updateLight(this, description.visibility, description.sides);
        }
    }

    remove() {
        this.lightContext.remove(this);
    }
}

export class DirectionalLight extends Light {
    constructor(coord, intensity, height, angle, width, channels = ALL_CHANNELS, colour = NO_COLOUR) {
        super(coord, intensity, height, channels, colour);
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

class SideProfile {
    constructor() {
        this.intensity = 0;
        this.colour = TRANSPARENT;
    }
}

class LightCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.lightingCentre = new Vec3(this.centre.x, this.centre.y, 0);
        this.profileSet = new Set();
        this.profileTable = new Array(MAX_NUM_LIGHTS);
        this.sides = new Array(Direction.length);
        this.intensity = 0;

        for (let i = 0; i < this.sides.length; i++) {
            this.sides[i] = new SideProfile();
        }

        /* Light colour framebuffer info */
        this.xOffset = x * Config.TILE_WIDTH;
        this.yOffset = y * Config.TILE_HEIGHT;
    }

    clearSides() {
        for (let i = 0; i < this.sides.length; i++) {
            let side = this.sides[i];
            side.intensity = 0;
            side.colour = TRANSPARENT;
        }
    }

    updateLight(light, intensity, sides) {
        if (!this.profileTable[light.id]) {
            this.profileTable[light.id] = new LightProfile(light, this);
        }
        let profile =this.profileTable[light.id];
        profile.update(intensity, sides);
        if (!profile.tracked) {
            this.profileSet.add(profile);
            profile.tracked = true;
        }
    }

    updateLightIntensityTotal(profile) {
        for (let i = 0; i < this.sides.length; i++) {
            if (profile.sides[i]) {
                this.sides[i].intensity += profile.intensity;
            }
        }
    }

    updateLightColourTotal(profile) {
        let intensityRatio = profile.intensity / profile.light.intensity;
        let colour = rgba32TransparentiseRatio(profile.light.colour, intensityRatio);

        for (let i = 0; i < this.sides.length; i++) {
            if (profile.sides[i]) {
                let side = this.sides[i];
                side.colour = rgba32Add(side.colour, colour);
            }
        }
    }

    updateTotals() {
        this.intensity = 0;
        this.clearSides();
        for (let profile of this.profileSet) {
            if (!profile.valid) {
                this.profileSet.delete(profile);
                profile.tracked = false;
                continue;
            }

            this.updateLightIntensityTotal(profile);

            if (profile.light.colour != NO_COLOUR) {
                this.updateLightColourTotal(profile);
            }
        }
    }

    remove(light) {
        let profile = this.profileTable[light.id];
        if (profile) {
            this.profileSet.delete(profile);
            this.profileTable[light.id] = null;
        }
    }
}

class LightGrid extends CellGrid(LightCell) {}

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
