import {Component} from './component.js';
import {Vec2} from './vec2.js';
import {assert} from './assert.js';

export class Position extends Component {
    constructor(x, y) {
        super();

        this._vector = new Vec2(0, 0);

        if (typeof x === 'number') {
            this._vector.set(x, y);
        } else {
            x.copyTo(this._vector);
        }

        return this;
    }

    copyTo(dest) {
        super.copyTo(dest);
        this._vector.copyTo(dest.vector);
    }

    clone() {
        return new Position(this._vector);
    }

    get x() {
        return this._vector.x;
    }

    get y() {
        return this._vector.y;
    }

    set x(value) {
        this.preChange();
        this._vector.x = value;
        this.postChange();
    }

    set y(value) {
        this.preChange();
        this._vector.y = value;
        this.postChange();
    }

    get vector() {
        return this._vector;
    }

    set vector(value) {
        this.preChange();
        this._vector.set(value);
        this.postChange();
    }

    preChange() {
        /* remove the entity from its cell */
        this.entity.cell.entities.delete(this.entity);
        this.entity.cell.recompute();
        this.entity.cell = null;

    }

    postChange() {
        /* add the entity to its spacial hash */
        let cell = this.ecsContext.spacialHash.get(this.vector);
        cell.entities.add(this.entity);
        this.entity.cell = cell;
        cell.recompute();
    }

    onAdd(entity) {
        super.onAdd(entity);

        /* add the entity to its spacial hash */
        entity.cell = this.ecsContext.spacialHash.get(this.vector);
        assert(entity.cell !== null);
        assert(entity.cell !== undefined);
        entity.cell.entities.add(entity);

        entity.cell.recompute();
    }

    onRemove(entity) {
        entity.cell.entities.delete(entity);
        entity.cell.recompute();
        entity.cell = null;
        super.onRemove(entity);
    }
}
