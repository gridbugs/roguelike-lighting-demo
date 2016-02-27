import {Vec2} from './vec2.js';

import * as Direction from './direction.js';

import {Grid} from './grid.js';

export class Cell {
    constructor(x, y, grid) {
        this.x = x;
        this.y = y;
        this.grid = grid;

        this.coord = new Vec2(x, y);

        /* Cell geometry */
        this.centre = new Vec2(x + 0.5, y + 0.5);
        this.corners = new Array(Direction.OrdinalDirections.length);
        for (let direction of Direction.OrdinalDirections) {
            this.corners[direction.subIndex] = this.centre.add(direction.vector.multiply(0.5));
        }

        /* Arrays of neighbours */
        this.neighbours = [];
        this.neighboursCardinal = [];
        this.neighboursOrdinal = [];

        /* Arrays of neighbours indexed by direction */
        this.neighboursByDirection = new Array(Direction.Directions.length);
        this.neighboursByCardinalDirection = new Array(Direction.CardinalDirections.length);
        this.neighboursByOrdinalDirection = new Array(Direction.OrdinalDirections.length);

        /* Handy information */
        this.distanceToEdge = this.grid.getDistanceToEdge(this.coord);

        /* Floodfill bookkeeping */
        this._floodFillCount = 0;

        this.outwardsDirection = null;
    }

    initNeighbours() {
        let ncoord = new Vec2();
        for (let direction of Direction.Directions) {

            this.coord.addInPlace(direction.vector, ncoord);

            if (this.grid.isValid(ncoord)) {

                let neighbour = this.grid.get(ncoord);

                this.neighbours.push(neighbour);
                this.neighboursByDirection[direction.index] = neighbour;

                if (direction.cardinal) {
                    this.neighboursCardinal.push(neighbour);
                    this.neighboursByCardinalDirection[direction.subIndex] = neighbour;
                } else {
                    this.neighboursOrdinal.push(neighbour);
                    this.neighboursByOrdinalDirection[direction.subIndex] = neighbour;
                }
            } else {
                this.neighboursByDirection[direction.index] = null;
                if (direction.cardinal) {
                    this.neighboursByCardinalDirection[direction.subIndex] = null;
                } else {
                    this.neighboursByCardinalDirection[direction.subIndex] = null;
                }
            }
        }
    }

    getNeighbour(direction) {
        return this.neighboursByDirection[direction.index];
    }

    isBorder() {
        return this.grid.isBorder(this.coord);
    }

    floodFillCompare(cell) {
        throw Error('unimplemented');
    }

    *floodFill(directions = Direction.Directions) {
        ++this.grid._floodFillCount;
        yield* this._floodFill(directions);
    }

    *_floodFill(directions) {
        this._floodFillCount = this.grid._floodFillCount;

        for (let direction of directions) {
            let neighbour = this.getNeighbour(direction);
            if (neighbour !== null &&
                neighbour._floodFillCount !== this.grid._floodFillCount &&
                this.floodFillCompare(neighbour) === 0
            ) {
                yield* neighbour._floodFill(directions);
            }
        }

        yield this;
    }
}

/* This function returns a cless which extends Grid by initializing an object
 * of the specified class in each cell and allowing the object to link its
 * neighbours together for convenient navigation. */
export function CellGrid(T) {
    return class CellGridInstance extends Grid {
        constructor(width, height) {
            super(width, height);
            for (let coord of super.coords()) {
                this.set(coord.x, coord.y, new T(coord.x, coord.y, this));
            }
            if (T.prototype.initNeighbours !== undefined) {
                for (let cell of this) {
                    cell.initNeighbours();
                }
            }

            this._floodFillCount = 0;

            this.initOutwardsDirections();

        }

        initOutwardsDirections() {
            for (let i = 1; i < this.limits.x; ++i) {
                this.get(i, 0).outwardsDirection = Direction.Direction.North;
                this.get(i, this.limits.y).outwardsDirection = Direction.Direction.South;
            }
            for (let i = 1; i < this.limits.y; ++i) {
                this.get(0, i).outwardsDirection = Direction.Direction.West;
                this.get(this.limits.x, i).outwardsDirection = Direction.Direction.East;
            }
        }

        *floodFill(directions = Direction.Directions) {
            ++this._floodFillCount;

            for (let cell of this) {
                if (cell._floodFillCount !== this._floodFillCount) {
                    /* Yield the generator so the caller can seperate
                     * different flood-filled regions */
                    yield cell._floodFill(directions);
                }
            }
        }

        *coords() {
            for (let cell of this) {
                yield cell.coord;
            }
        }
    }
}
