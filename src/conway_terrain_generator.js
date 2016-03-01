import {Config} from 'config.js';
import {EntityPrototypes} from 'entity_prototypes.js';
import {Components} from 'components.js';
import {Level} from 'engine/level.js';
import {CellGrid, Cell} from 'utils/cell_grid.js';
import {getRandomBool, getRandomInt, getRandomIntInclusive} from 'utils/random.js';
import {getRandomElement, shuffleInPlace, getBestIndex} from 'utils/array_utils.js';
import {makeEnum} from 'utils/enum.js';
import {Vec2} from 'utils/vec2.js';
import {DijkstraMap, DijkstraCell} from 'utils/dijkstra_map.js';
import {BestTracker} from 'utils/best_tracker.js';

class ConwayCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.alive = false;
        this.nextAlive = false;
    }

    step() {
        this.alive = this.nextAlive;
    }

    countAliveNeighbours() {
        let count = 0;
        for (let n of this.neighbours) {
            if (n.alive) {
                ++count;
            }
        }
        return count;
    }
}

class ConwayGrid extends CellGrid(ConwayCell) {}

const CellType = makeEnum([
    'NaturalFloor',
    'NaturalWall',
    'Wall',
    'Floor',
    'Door',
    'DownStairs',
    'UpStairs',
    'CollapsedUpStairs'
]);

function isWallType(type) {
    return type === CellType.NaturalWall || type === CellType.Wall;
}

class RoomCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.wall = false;
        this.original = null;
        this.group = -1;
    }

    floodFillCompare(cell) {
        return this.original.floodFillCompare(cell.original);
    }
}

class Room extends CellGrid(RoomCell) {
    constructor(width, height) {
        super(width, height);
        for (let cell of this.border()) {
            cell.wall = true;
        }
        this.centreCoord = new Vec2(Math.floor(width / 2), Math.floor(height / 2));
    }

    classifyCells() {
        this.groupSizes = [];
        this.groupTypes = [];
        let group = 0;
        for (let region of this.floodFill()) {
            let count = 0;
            let first = null;
            for (let cell of region) {
                ++count;
                cell.group = group;
                if (first === null) {
                    first = cell;
                }
            }
            this.groupSizes[group] = count;
            this.groupTypes[group] = first.original.type;
            ++group;
        }
        return group;
    }
}

class DoorDistanceCell extends DijkstraCell {
    isEnterable() {
        let cell = this.grid.grid.get(this.coord);
        return cell.type == CellType.NaturalFloor;
    }
}

class DoorDistanceMap extends DijkstraMap(DoorDistanceCell) {
    constructor(width, height, grid) {
        super(width, height);
        this.grid = grid;
    }
}

class WallDistanceCell extends DijkstraCell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.stairsDistance = -1;
    }
    isEnterable() {
        return true;
    }
}

class WallDistanceMap extends DijkstraMap(WallDistanceCell) {
}

class DoorCandidate {
    constructor(cell, roomCell, direction, outside) {
        this.cell = cell;
        this.roomCell = roomCell;
        this.direction = direction;
        this.outside = outside;
    }
}

class GeneratorCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.type = CellType.NaturalFloor;
        this.naturalGroup = -1;
        this.group = -1;
    }

    floodFillCompare(cell) {
        if (isWallType(this.type) === isWallType(cell.type)) {
            return 0;
        }
        return 1;
    }

    get naturalGroupSize() {
        return this.grid.naturalGroupSizes[this.naturalGroup];
    }

    get naturalGroupType() {
        return this.grid.naturalGroupTypes[this.naturalGroup];
    }

    get groupSize() {
        return this.grid.groupSizes[this.group];
    }
}

class GeneratorGrid extends CellGrid(GeneratorCell) {
    constructor(width, height) {
        super(width, height);
        this.doorDistanceMap = new DoorDistanceMap(width, height, this);
        this.distanceFromWallsMap = new WallDistanceMap(width, height);
        this.naturalGroupSizes = [];
        this.naturalGroupTypes = [];
        this.groupSizes = [];
        this.groupIsWall = [];
        this.floorGroups = [];
        this.biggestFloorGroup = -1;
        this.stairsCandidates = [];
    }

    *wallCells() {
        for (let cell of this) {
            if (cell.type === CellType.Wall ||
                cell.type === CellType.NaturalWall ||
                cell.type === CellType.Door ||
                cell.type === CellType.Floor) {
                yield this.distanceFromWallsMap.get(cell.coord);
            }
        }
    }

    computeWallDistances() {
        this.distanceFromWallsMap.computeFromZeroCoords(this.wallCells());
    }

    scoreRoom(room, offset) {
        if (!this.isValid(room.limits.add(offset))) {
            return -1;
        }
        let coord = new Vec2(0, 0);
        for (let roomCell of room) {
            roomCell.coord.addInPlace(offset, coord);
            let cell = this.get(coord);
            if (cell.type === CellType.NaturalWall ||
                cell.type === CellType.NaturalFloor) {
                roomCell.original = cell;
            } else {
                return -1;
            }
        }
        for (let roomCell of room.edge()) {
            roomCell.coord.addInPlace(offset, coord);
            let cell = this.get(coord);
            let outside = cell.getNeighbour(roomCell.outwardsDirection);
            if (outside !== null && outside.type === CellType.Wall) {
                return -1;
            }
        }

        let numGroups = room.classifyCells();

        let numWalls = 0;
        let numFloors = 0;
        let wallSizeThreshold = 10;
        let floorSizeThreshold = 10;
        let numWallThreshold = 10;
        let numFloorThreshold = 10;

        let hasDoorCandidate = false;
        let doorGroupSizeThreshold = 20;

        for (let roomCell of room) {
            if (roomCell.original.naturalGroupType === CellType.NaturalWall &&
                roomCell.original.naturalGroupSize >= wallSizeThreshold) {
                ++numWalls;
            }
            if (roomCell.original.naturalGroupType === CellType.NaturalFloor &&
                roomCell.original.naturalGroupSize >= floorSizeThreshold) {
                ++numFloors;
            }
        }

        for (let roomCell of room.edge()) {
            let neighbour = roomCell.original.getNeighbour(roomCell.outwardsDirection);
            if (neighbour === null) {
                continue;
            }
            if (neighbour.naturalGroupType === CellType.NaturalFloor &&
                neighbour.naturalGroupSize >= doorGroupSizeThreshold) {
                hasDoorCandidate = true;
            }
        }

        if (numWalls >= numWallThreshold &&
            numFloors >= numFloorThreshold &&
            hasDoorCandidate) {
            return 1;
        }

        return 0;
    }

    *roomPositionCandidates(room) {
        const attempts = 10;
        for (let i = 0; i < attempts; ++i) {
            let coord = this.getRandom().coord;
            let score = this.scoreRoom(room, coord);
            if (score > 0) {
                yield coord;
            }
        }
    }

    addRoom(room, offset, randomDoors = false) {
        let coord = new Vec2(0, 0);
        for (let roomCell of room) {
            roomCell.coord.addInPlace(offset, coord);
            let cell = this.get(coord);
            if (roomCell.isBorder()) {
                cell.type = CellType.Wall;
            } else {
                cell.type = CellType.Floor;
            }
        }
        let doorCandidates = [];
        for (let roomCell of room.edge()) {
            roomCell.coord.addInPlace(offset, coord);
            let cell = this.get(coord);
            let outside = cell.getNeighbour(roomCell.outwardsDirection);
            if (outside !== null &&
                outside.type === CellType.NaturalFloor) {
                doorCandidates.push(new DoorCandidate(cell, roomCell, roomCell.outwardsDirection, outside));
            }
        }

        let count = 0;
        while (doorCandidates.length > 0) {
            shuffleInPlace(doorCandidates);
            let door = doorCandidates.pop();
            this.doorDistanceMap.computeFromZeroCoord(door.outside.coord);

            doorCandidates = doorCandidates.filter(
                (c) => {
                    let distanceCell = this.doorDistanceMap.get(c.outside.coord);
                    if (distanceCell.seen) {
                        return distanceCell.value > Math.max(room.width, room.height);
                    } else {
                        return true;
                    }
                }
            );

            if (Math.random() > 0.2 || !randomDoors) {
                door.cell.type = CellType.Door;
            } else {
                door.cell.type = CellType.Floor;
            }

            ++count;
        }

        room.centreCoord.addInPlace(offset, coord);
        this.stairsCandidates.push(this.get(coord));
    }
}

export class ConwayTerrainGenerator {
    constructor(depth = 0, hasPlayer = false, parent = null) {
        this.conwayGrid = new ConwayGrid(Config.GRID_WIDTH, Config.GRID_HEIGHT);
        this.grid = new GeneratorGrid(Config.GRID_WIDTH, Config.GRID_HEIGHT);
        this.randomize();
        this.nextLevel = null;
        this.depth = depth;
        this.parent = parent;
        this.hasPlayer = hasPlayer;
        this.playerCharacterStartCell = null;
        this.level = null;

        this.finalDepth = 4;

        this.numSteps = 2;
        this.liveMin = 4;
        this.liveMax = 8;
        this.resMin = 5;
        this.resMax = 5;
    }

    randomize() {
        for (let cell of this.conwayGrid) {
            cell.alive = getRandomBool();
        }
    }

    step(liveMin, liveMax, resMin, resMax) {
        for (let cell of this.conwayGrid) {
            if (cell.isBorder()) {
                cell.nextAlive = true;
                continue;
            }

            let count = cell.countAliveNeighbours();

            if (cell.alive) {
                cell.nextAlive = count >= liveMin && count <= liveMax;
            } else {
                cell.nextAlive = count >= resMin && count <= resMax;
            }
        }

        for (let cell of this.conwayGrid) {
            cell.step();
        }
    }

    runAutomata(numSteps, liveMin, liveMax, resMin, resMax) {
        for (let i = 0; i < numSteps; ++i) {
            this.step(liveMin, liveMax, resMin, resMax);
        }
    }

    fillGaps(minNeighbours, iterations) {
        for (let i = 0; i < iterations; ++i) {
            for (let cell of this.conwayGrid) {
                let count = cell.countAliveNeighbours();
                if (count > minNeighbours) {
                    cell.alive = true;
                }
            }
        }
    }

    removeSingles() {
        for (let cell of this.conwayGrid) {
            let count = cell.countAliveNeighbours();
            if (count === 0) {
                cell.alive = false;
            }
        }
    }

    generateNatural() {
        this.runAutomata(this.numSteps, this.liveMin, this.liveMax, this.resMin, this.resMax);
        this.fillGaps(4, 4);
        this.removeSingles();

        for (let conwayCell of this.conwayGrid) {
            let cell = this.grid.get(conwayCell.coord);
            if (conwayCell.alive) {
                cell.type = CellType.NaturalWall;
            } else {
                cell.type = CellType.NaturalFloor;
            }
        }

        let group = 0;
        for (let region of this.grid.floodFill()) {
            let count = 0;
            let first = null;
            for (let cell of region) {
                ++count;
                cell.naturalGroup = group;
                if (first === null) {
                    first = cell;
                }
            }
            this.grid.naturalGroupSizes[group] = count;
            this.grid.naturalGroupTypes[group] = first.type;
            ++group;
        }
    }

    generateRooms(numTypes, numPerType, minSize, maxSize, randomDoors = false) {
        for (let i = 0; i < numTypes; ++i) {
            let room = new Room(
                getRandomIntInclusive(minSize, maxSize),
                getRandomIntInclusive(minSize, maxSize)
            );
            let candidates = this.grid.roomPositionCandidates(room);
            let count = 0;
            for (let coord of candidates) {
                if (count >= numPerType) {
                    break;
                }
                this.grid.addRoom(room, coord, randomDoors);
                ++count;
            }
        }
    }

    generateAllRooms() {
        this.generateRooms(getRandomIntInclusive(2, 5), 1, 8, 14, true);
        this.generateRooms(getRandomIntInclusive(2, 5), 1, 6, 10, true);
    }

    generateStairs() {
        let candidates = this.grid.stairsCandidates.filter((cell) => {
            return cell.group === this.grid.biggestFloorGroup;
        });

        shuffleInPlace(candidates);

        let maxDistance = 0;
        let aCandidate, bCandidate;
        for (let i = 0; i < candidates.length; ++i) {
            let a = candidates[i];
            for (let j = i; j < candidates.length; ++j) {
                let b = candidates[j];
                let distance = a.coord.getDistance(b.coord);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    aCandidate = a;
                    bCandidate = b;
                    if (Math.random() < 0.5) {
                        aCandidate = b;
                        bCandidate = a;
                    }
                }
            }
        }

        aCandidate.type = CellType.DownStairs;
        if (this.parent !== null) {
            bCandidate.type = CellType.UpStairs;
        }
    }

    classifyGroups() {
        let group = 0;
        for (let region of this.grid.floodFill()) {
            let count = 0;
            let first = null;
            for (let cell of region) {
                cell.group = group;
                ++count;
                if (first === null) {
                    first = cell;
                }
            }
            this.grid.groupSizes[group] = count;
            let wall = isWallType(first.type);
            this.grid.groupIsWall[group] = wall;
            if (!wall) {
                this.grid.floorGroups.push(group);
            }
            ++group;
        }

        let floorGroupSizes = this.grid.floorGroups.map((i) => {
            return this.grid.groupSizes[i];
        });
        let bestIndex = getBestIndex(floorGroupSizes);
        this.grid.biggestFloorGroup = this.grid.floorGroups[bestIndex];
    }

    getPlayerCharacterStart(target) {
        let best = new BestTracker((a, b) => {
            return (a.stairsDistance + a.value * 2) -
                   (b.stairsDistance + b.value * 2);
        });
        this.grid.computeWallDistances();
        for (let cell of this.grid.distanceFromWallsMap) {
            let gridCell = this.grid.get(cell.coord);
            if (cell.value !== 0 && gridCell.group === this.grid.biggestFloorGroup) {
                cell.stairsDistance = cell.coord.getDistance(target.coord);
                best.insert(cell);
            }
        }
        return this.grid.get(best.best.coord);
    }

    placePlayerCharacter(ecs) {
        let startCell = this.getPlayerCharacterStart(this.downStairs.cell);
        return ecs.emplaceEntity(EntityPrototypes.PlayerCharacter(startCell.coord));
    }

    generate(level, ecs) {

        this.level = level;
        let nextDepth = this.depth + 1;
        if (nextDepth === this.finalDepth) {
            this.nextLevel = new Level(new FinalConwayTerrainGenerator(nextDepth, false, this));
        } else {
            this.nextLevel = new Level(new ConwayTerrainGenerator(nextDepth, false, this));
        }

        this.generateNatural();
        this.generateAllRooms();
        this.classifyGroups();
        this.generateStairs();

        for (let cell of this.grid) {
            switch (cell.type) {
                case CellType.NaturalFloor: {
                    ecs.emplaceEntity(EntityPrototypes.IceFloor(cell.x, cell.y));
                    break;
                }
                case CellType.NaturalWall: {
                    ecs.emplaceEntity(EntityPrototypes.IceWall(cell.x, cell.y));
                    ecs.emplaceEntity(EntityPrototypes.IceFloor(cell.x, cell.y));
                    break;
                }
                case CellType.Floor: {
                    ecs.emplaceEntity(EntityPrototypes.StoneFloor(cell.x, cell.y));
                    break;
                }
                case CellType.Wall: {
                    ecs.emplaceEntity(EntityPrototypes.BrickWall(cell.x, cell.y));
                    ecs.emplaceEntity(EntityPrototypes.StoneFloor(cell.x, cell.y));
                    break;
                }
                case CellType.Door: {
                    ecs.emplaceEntity(EntityPrototypes.WoodenDoor(cell.x, cell.y));
                    ecs.emplaceEntity(EntityPrototypes.StoneFloor(cell.x, cell.y));
                    break;
                }
                case CellType.CollapsedUpStairs: {
                    ecs.emplaceEntity(EntityPrototypes.StoneFloor(cell.x, cell.y));
                    let stairs = ecs.emplaceEntity(EntityPrototypes.CollapsedUpStairs(cell.x, cell.y));
                    this.parent.downStairs.get(Components.DownStairs).upStairs = stairs;
                    break;
                }
                case CellType.UpStairs: {
                    ecs.emplaceEntity(EntityPrototypes.StoneFloor(cell.x, cell.y));
                    let stairs = ecs.emplaceEntity(EntityPrototypes.UpStairs(cell.x, cell.y));
                    this.parent.downStairs.get(Components.DownStairs).upStairs = stairs;
                    stairs.get(Components.UpStairs).downStairs = this.parent.downStairs;
                    stairs.get(Components.UpStairs).level = this.parent.level;
                    break;
                }
                case CellType.DownStairs: {
                    ecs.emplaceEntity(EntityPrototypes.StoneFloor(cell.x, cell.y));
                    let stairs;
                    if (nextDepth === this.finalDepth) {
                        stairs = ecs.emplaceEntity(EntityPrototypes.CathedralDownStairs(cell.x, cell.y));
                    } else {
                        stairs = ecs.emplaceEntity(EntityPrototypes.DownStairs(cell.x, cell.y));
                    }
                    stairs.get(Components.DownStairs).level = this.nextLevel;
                    this.downStairs = stairs;
                    break;
                }
            }
        }

        this.populate(ecs);
    }

    populate(ecs) {
        let playerCharacter;
        if (this.hasPlayer) {
            playerCharacter = this.placePlayerCharacter(ecs);
        }

        let candidates = [];
        for (let cell of this.grid) {
            if (cell.group === this.grid.biggestFloorGroup) {
                if (this.hasPlayer &&
                    playerCharacter.cell.coord.getDistance(cell.coord) < 10) {
                    continue;
                }
                if (cell.type === CellType.Door) {
                    continue;
                }
                candidates.push(cell);
            }
        }
        shuffleInPlace(candidates);

        let add = (num, name) => {
            for (let i = 0; i < num; ++i) {
                let cell = candidates.pop();
                ecs.emplaceEntity(EntityPrototypes[name](cell.coord));
            }
        }

        switch (this.depth) {
            case 1:
                add(5, 'SpiderChild');
                add(1, 'Mouths');
                break;
            case 2:
                add(4, 'SpiderChild');
                add(2, 'Mouths');
                add(2, 'Sprite');
                break;
            case 3:
                add(2, 'SpiderChild');
                add(2, 'Mouths');
                add(4, 'Sprite');
                add(2, 'Guardian');
                break;
        }

    }
}

export class FinalConwayTerrainGenerator extends ConwayTerrainGenerator {
    constructor(depth = 0, hasPlayer = false, parent = null) {
        super(depth, hasPlayer, parent);

        this.numSteps = 10;
        this.liveMin = 4;
        this.liveMax = 8;
        this.resMin = 5;
        this.resMax = 5;
    }

    generateAllRooms() {
        this.generateRooms(1, 1, 10, 20, false);
    }

    generateStairs() {
        let cell = this.getPlayerCharacterStart(this.grid.stairsCandidates[0]);
        cell.type = CellType.CollapsedUpStairs;
    }

    populate(ecs) {
        ecs.emplaceEntity(EntityPrototypes.PyroGod(this.grid.stairsCandidates[0].coord));
    }
}
