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
}

/* This function returns a cless which extends Grid by initializing an object
 * of the specified class in each cell and allowing the object to link its
 * neighbours together for convenient navigation. */
export function CellGrid(T) {
    return class CellGridInstance extends Grid {
        constructor(width, height) {
            super(width, height);
            for (let [x, y] of this.coords()) {
                this.set(x, y, new T(x, y, this));
            }
            if (T.prototype.initNeighbours !== undefined) {
                console.debug('hi');
                for (let cell of this) {
                    cell.initNeighbours();
                }
            }
        }
    }
}
