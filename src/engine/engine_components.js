import {Component, ArrayComponent} from 'engine/component';
import {Vec2} from 'utils/vec2';
import {assert} from 'utils/assert';
import {makeEnumInts} from 'utils/enum';

export class TurnTaker extends Component {
    constructor(controller) {
        super();
        this.controller = controller;
        this.nextTurn = null;
    }

    get scheduled() {
        return this.nextTurn != null;
    }

    clone() {
        return new TurnTaker(this.controller);
    }

    onAdd(entity) {
        super.onAdd(entity);
        this.controller.entity = entity;
        this.ecsContext.scheduleTurn(entity, 0);
    }

    onRemove(entity) {
        if (this.nextTurn != null) {
            this.nextTurn.enabled = false;
        }
        super.onRemove(entity);
    }
}

TurnTaker.prototype.takeTurn = async function() {
    return await this.controller.takeTurn();
}

export class PlayerCharacter extends Component {}
export class Scheduled extends Component {}

export class Position extends ArrayComponent {
    constructor(x, y) {
        super(1);

        this.vector = new Vec2(0, 0);

        if (typeof x == 'number') {
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

    get vector() {
        return this.fields[Position.Vector];
    }

    set vector(value) {
        this.fields[Position.Vector] = value;
    }

    onAdd(entity) {
        super.onAdd(entity);

        /* add the entity to its spacial hash */
        entity.cell = this.ecsContext.spacialHash.get(this.vector);
        assert(entity.cell != null);
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
Position.Vector = 0;
