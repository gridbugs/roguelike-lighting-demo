import {Component} from './component.js';
import {Vec2} from './vec2.js';
import {assert} from './assert.js';

export class Position extends Component {
    constructor(x, y) {
        super();

        this.vector = new Vec2(0, 0);

        if (typeof x === 'number') {
            this.vector.set(x, y);
        } else {
            x.copyTo(this.vector);
        }

        return this;
    }

    copyTo(dest) {
        super.copyTo(dest);
        this.vector.copyTo(dest.vector);
    }

    clone() {
        return new Position(this.vector);
    }

    get x() {
        return this.vector.x;
    }

    get y() {
        return this.vector.y;
    }

    set x(value) {
        this.vector.x = value;
    }

    set y(value) {
        this.vector.y = value;
    }

    onAdd(entity) {
        super.onAdd(entity);

        /* add the entity to its spacial hash */
        entity.cell = this.ecsContext.spacialHash.get(this.vector);
        assert(entity.cell !== null);
        assert(entity.cell !== undefined);
        entity.cell.entities.add(entity);
    }

    onRemove(entity) {
        entity.cell.entities.delete(entity);
        entity.cell = null;
        super.onRemove(entity);
    }
}

export class Tile extends Component {
    constructor(tile, depth) {
        super();
        this.tile = tile;
        this.depth = depth;
    }
}

export class WallTile extends Component {
    constructor(frontTile, topTile, depth) {
        super();
        this.frontTile = frontTile;
        this.topTile = topTile;
        this.depth = depth;
    }
}

export class Solid extends Component {
}

export class Opacity extends Component {
    constructor(value) {
        super();
        this.value = value;
    }
}
