import {Vec2} from './vec2.js';
import {makeEnum} from './enum.js';

export const DirectionType = makeEnum([
    'Cardinal',
    'Ordinal'
]);

class DirectionInfo {
    constructor(x, y, name, type, index) {
        this.vector = new Vec2(x, y);
        this.index = index;
        this.name = name;
        this.type = type;
    }

    get cardinal() {
        return this.type === DirectionType.Cardinal;
    }

    get ordinal() {
        return this.type === DirectionType.Ordinal;
    }
}

function d(x, y, name, type, index) {
    return new DirectionInfo(x, y, name, type, index);
}

const C = DirectionType.Cardinal;
const O = DirectionType.Ordinal;

export const Direction = makeEnum({
    North:      d(+0, -1, 'North', C, 0),
    East:       d(+1, +0, 'East', C, 1),
    South:      d(+0, +1, 'South', C, 2),
    West:       d(-1, +0, 'West', C, 3),
    NorthEast:  d(+1, -1, 'NorthEast', O, 4),
    SouthEast:  d(+1, +1, 'SouthEast', O, 5),
    SouthWest:  d(-1, +1, 'SouthWest', O, 6),
    NorthWest:  d(-1, -1, 'NorthWest', O, 7)
});

export const Directions = Direction.values;
export const CardinalDirections = [for (dir of Directions) if (dir.cardinal) dir];
export const OrdinalDirections = [for (dir of Directions) if (dir.ordinal) dir];
export const DirectionIndices = [for (dir of Directions) dir.index];
export const CardinalDirectionIndices = [for (dir of CardinalDirections) dir.index];
export const OrdinalDirectionIndices = [for (dir of OrdinalDirections) dir.index];
