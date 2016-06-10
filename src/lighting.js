import {CellGrid, Cell} from 'utils/cell_grid';
import {VisionCellList} from 'vision';
import {detectVisibleArea, detectVisibleAreaConstrained} from 'shadowcast';
import {Vec3} from 'utils/vec3.js';
import {normalize} from 'utils/angle';
import {UINT32_MAX} from 'utils/limits';
import {Components} from 'components';
import {ObjectPool} from 'utils/object_pool';
import {Direction, AllDirectionBits, NumDirections} from 'utils/direction';
import {createCanvasContext} from 'utils/canvas';
import {Config} from 'config';
import {constrain} from 'utils/arith';
import {ArrayCollection} from 'utils/array_collection';
import {rgba32DarkenRatio, rgba32TransparentiseRatio, rgba32Add, TRANSPARENT} from 'utils/rgba32';
import {DoublyLinkedList} from 'utils/doubly_linked_list';
import {IndexAllocator} from 'utils/index_allocator';
import {assert} from 'utils/assert';

export const ALL_CHANNELS = UINT32_MAX;

export const NO_COLOUR = TRANSPARENT;

const LIGHT_DISTANCE = 100;
const MAX_NUM_LIGHTS = 100;

const SURFACE_NORMAL = new Vec3(0, 0, 1);

const WORKING_VEC3 = new Vec3(0, 0, 0);

class LightProfile {
    constructor(light, cell) {
        this.light = light;
        this.cell = cell;
        this.intensity = 0;
        this.sequence = 0;
        this.sides = 0;

        /* linked list node containing this profile */
        this.node = null;
    }

    getIntensity(point) {
        /* Compute the dot product of the normalised surface normal and
         * the normalised vector from the point to the light. This will
         * be used to reduce the intensity of the light to represent
         * the fact that the light is hitting the cell at an angle. */
        this.light.vector.subtractInPlace(point, WORKING_VEC3);
        WORKING_VEC3.normalizeInPlace(WORKING_VEC3);
        let dot = SURFACE_NORMAL.dot(WORKING_VEC3);
        return dot * this.light.intensity;
    }

    update(intensity, sides) {
        this.intensity = intensity * this.getIntensity(this.cell.lightingCentre);
        this.sequence = this.light.sequence;
        this.sides = sides;
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

    getCoord(coord) {
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
        this.sides = 0;
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

export class Light {
    constructor(coord, intensity, height, channels = ALL_CHANNELS, colour = NO_COLOUR) {

        this.id = -1;

        this.coord = coord;
        this.intensity = intensity;
        this._height = height;

        this.vector = new Vec3(coord.x + 0.5, coord.y + 0.5, height);
        this.lightContext = null;

        this.sequence = 0;

        this.channels = channels;
        this.colour = colour;

        if (channels == ALL_CHANNELS) {
            this.maskedSpacialHash = null;
            this.maskedVisionCellList = null;
        } else {
            this.maskedSpacialHash = new MaskedSpacialHash(this, channels);
            this.maskedVisionCellList = new MaskedVisionCellList(this, channels);
        }
    }

    setLightContext(lightContext) {
        this.lightContext = lightContext;
        this.id = lightContext.indexAllocator.allocate();
    }

    get visionCellList() {
        return this.lightContext.visionCells;
    }

    get spacialHash() {
        return this.lightContext.ecsContext.spacialHash;
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
        let spacialHash, visionCellList;

        if (this.channels == ALL_CHANNELS) {
            spacialHash = this.spacialHash;
            visionCellList = this.visionCellList;
        } else {
            spacialHash = this.maskedSpacialHash;
            visionCellList = this.maskedVisionCellList;
            this.maskedSpacialHash.transparentCellPool.flush();
        }

        detectVisibleArea(this.coord, LIGHT_DISTANCE, spacialHash, visionCellList);
    }

    updateLitCells() {
        this.sequence++;

        this.visionCellList.clear();
        this.detectVisibleArea();

        for (let i = 0; i < this.visionCellList.pool.index; i++) {
            let description = this.visionCellList.pool.array[i];
            let lightCell = this.lightContext.grid.get(description.cell);
            lightCell.updateLight(this, description.visibility, description.sides);
        }
    }

    remove() {
        this.lightContext.remove(this);
        assert(this.id != -1);
        this.lightContext.indexAllocator.free(this.id);
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

        let spacialHash, visionCellList;

        if (this.channels == ALL_CHANNELS) {
            spacialHash = this.spacialHash;
            visionCellList = this.visionCellList;
        } else {
            spacialHash = this.maskedSpacialHash;
            visionCellList = this.maskedVisionCellList;
            this.maskedSpacialHash.transparentCellPool.flush();
        }

        detectVisibleAreaConstrained(this.coord, LIGHT_DISTANCE, spacialHash,
                visionCellList, startAngle, endAngle);
    }
}

class SideProfile {
    constructor() {
        this.intensity = 0;
        this.colour = TRANSPARENT;
    }
}

class LightCell extends Cell {
    constructor(x, y, grid, lightContext) {
        super(x, y, grid);
        this.lightingCentre = new Vec3(this.centre.x, this.centre.y, 0);
        this.profileTable = new Array(MAX_NUM_LIGHTS);
        this.profileList = new DoublyLinkedList();
        this.sides = new Array(Direction.length);
        this.intensity = 0;
        this.lightContext = lightContext;
        this.lastSequence = -1;

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

    removeProfile(profile) {
        this.profileList.deleteNode(profile.node);
        profile.node = null;
    }

    updateLight(light, intensity, sides) {
        let profile = this.profileTable[light.id];
        if (!profile) {
            profile = new LightProfile(light, this);
            this.profileTable[light.id] = profile;
        }
        profile.update(intensity, sides);
        if (!profile.node) {
            profile.node = this.profileList.push(profile);
        }

        this.lastSequence = this.lightContext.sequence;
    }

    updateLightIntensityTotal(profile) {
        for (let i = 0; i < NumDirections; i++) {
            if (profile.sides & (1 << i)) {
                this.sides[i].intensity += profile.intensity;
            }
        }
    }

    updateLightColourTotal(profile) {
        let intensityRatio = profile.intensity / profile.light.intensity;
        let colour = rgba32TransparentiseRatio(profile.light.colour, intensityRatio);
        colour = rgba32DarkenRatio(colour, intensityRatio);

        for (let i = 0; i < NumDirections; i++) {
            if (profile.sides & (1 << i)) {
                let side = this.sides[i];
                side.colour = rgba32Add(side.colour, colour);
            }
        }
    }

    updateTotals() {

        if (this.lastSequence != this.lightContext.sequence) {
//            return;
        }

        this.intensity = 0;
        this.clearSides();
        for (let node = this.profileList.headNode; node != null; node = node.next) {
            let profile = node.value;
            if (!profile.valid) {
                this.removeProfile(profile);
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
            this.profileTable[light.id] = null;
            if (profile.node != null) {
                this.removeProfile(profile);
            }
        }
    }
}

class LightGrid extends CellGrid(LightCell) {}

export class LightContext {
    constructor(ecsContext) {
        this.lights = new Set();
        this.ecsContext = ecsContext;
        this.grid = new LightGrid(ecsContext.width, ecsContext.height, this);
        this.visionCells = new VisionCellList(ecsContext);
        this.indexAllocator = new IndexAllocator();

        this.sequence = 0;
    }

    beginUpdate() {}
    endUpdate() {
        this.sequence++;
    }

    remove(light) {
        this.lights.delete(light);
        for (let i = 0; i < this.grid.size; i++) {
            let cell = this.grid.array[i];
            cell.remove(light);
        }
    }
}
