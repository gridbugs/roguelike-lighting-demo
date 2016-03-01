import {spread} from 'utils/spread';
import {Direction} from 'utils/direction';

export class Line {
    constructor(startCoord, endCoord) {
        this.startCoord = startCoord;
        this.endCoord = endCoord;

        this.setLineDirection();
    }

    setLineDirection() {
        let dx = this.endCoord.x - this.startCoord.x;
        let dy = this.endCoord.y - this.startCoord.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                this.cardinalDirection = Direction.East;
                if (dy > 0) {
                    this.ordinalDirection = Direction.SouthEast;
                } else {
                    //dy <= 0
                    this.ordinalDirection = Direction.NorthEast;
                }
            } else {
                // dx <= 0
                this.cardinalDirection = Direction.West;
                if (dy > 0) {
                    this.ordinalDirection = Direction.SouthWest;
                } else {
                    //dy <= 0
                    this.ordinalDirection = Direction.NorthWest;
                }
            }
        } else {
            // abs(dx) <= abs(dy)
             if (dy > 0) {
                this.cardinalDirection = Direction.South;
                if (dx > 0) {
                    this.ordinalDirection = Direction.SouthEast;
                } else {
                    //dx <= 0
                    this.ordinalDirection = Direction.SouthWest;
                }
            } else {
                // dx <= 0
                this.cardinalDirection = Direction.North;
                if (dx > 0) {
                    this.ordinalDirection = Direction.NorthEast;
                } else {
                    //dx <= 0
                    this.ordinalDirection = Direction.NorthWest;
                }
            }
        }

        this.ordinalCount = Math.min(Math.abs(dx), Math.abs(dy));
        this.cardinalCount = Math.max(Math.abs(dx), Math.abs(dy)) - this.ordinalCount;
    }

    *directions() {
        yield* spread(this.cardinalDirection, this.ordinalDirection, this.cardinalCount, this.ordinalCount);
    }

    *vectors() {
        for (let direction of this.directions()) {
            yield direction.vector;
        }
    }

    *relativeCoords(start) {

        let current = start.clone();

        for (let step of this.vectors()) {
            current.addInPlace(step, current);
            yield current;
        }
    }

    *absoluteCoords() {
        yield* this.relativeCoords(this.startCoord);
    }

    *infiniteRelativeCoords(start) {
        let current = start;

        while (true) {
            for (let coord of this.relativeCoords(current)) {
                yield coord;
                current = coord;
            }
        }
    }

    *infiniteAbsoluteCoords() {
        yield* this.infiniteRelativeCoords(this.startCoord);
    }
}
