import {Typed} from 'engine/typed';
import {assert} from 'utils/assert';

export class Component extends Typed {
    constructor(...args) {
        super();
        this.valid = true;
        this.entity = null;
        this._ = this.name;
    }

    get ecsContext() {
        assert(this.entity !== null);
        assert(this.entity.ecsContext !== null);
        return this.entity.ecsContext;
    }

    /* Turns dest into a copy of this */
    copyTo(dest) {
        dest.valid = this.valid;
    }

    clone() {
        return new this.constructor();
    }

    is(ctor) {
        return this.type === ctor.type;
    }

    onAdd(entity) {
        assert(entity.ecsContext !== null);
        this.entity = entity;
    }

    onRemove(entity) {
        assert(entity.ecsContext !== null);
        this.entity = null;
    }
}
