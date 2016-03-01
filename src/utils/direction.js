import {Vec2} from 'utils/vec2';
import {makeEnum} from 'utils/enum';
import {SQRT2} from 'utils/math';

export const DirectionType = makeEnum([
    'Cardinal',
    'Ordinal'
]);

class DirectionInfo {
    constructor(x, y, name, type, index, subIndex, multiplier) {
        this.vector = new Vec2(x, y);
        this.name = name;
        this.type = type;
        this.index = index;
        this.subIndex = subIndex;
        this.opposite = null;
        this.multiplier = multiplier;
    }

    get cardinal() {
        return this.type === DirectionType.Cardinal;
    }

    get ordinal() {
        return this.type === DirectionType.Ordinal;
    }
}

function d(x, y, name, type, index, subIndex, multiplier) {
    return new DirectionInfo(x, y, name, type, index, subIndex, multiplier);
}

const C = DirectionType.Cardinal;
const O = DirectionType.Ordinal;

export const Direction = makeEnum({
    North:      d(+0, -1, 'North', C, 0, 0, 1),
    East:       d(+1, +0, 'East', C, 1, 1, 1),
    South:      d(+0, +1, 'South', C, 2, 2, 1),
    West:       d(-1, +0, 'West', C, 3, 3, 1),
    NorthEast:  d(+1, -1, 'NorthEast', O, 4, 0, SQRT2),
    SouthEast:  d(+1, +1, 'SouthEast', O, 5, 1, SQRT2),
    SouthWest:  d(-1, +1, 'SouthWest', O, 6, 2, SQRT2),
    NorthWest:  d(-1, -1, 'NorthWest', O, 7, 3, SQRT2)
});

Direction.North.opposite = Direction.South;
Direction.South.opposite = Direction.North;
Direction.East.opposite = Direction.West;
Direction.West.opposite = Direction.East;
Direction.NorthWest.opposite = Direction.SouthEast;
Direction.SouthEast.opposite = Direction.NorthWest;
Direction.SouthWest.opposite = Direction.NorthEast;
Direction.NorthEast.opposite = Direction.SouthWest;

export const Directions = Direction.values;
export const CardinalDirections = [for (dir of Directions) if (dir.cardinal) dir];
export const OrdinalDirections = [for (dir of Directions) if (dir.ordinal) dir];
export const DirectionIndices = [for (dir of Directions) dir.index];
export const CardinalDirectionIndices = [for (dir of CardinalDirections) dir.index];
export const OrdinalDirectionIndices = [for (dir of OrdinalDirections) dir.index];
