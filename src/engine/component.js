import {Typed} from 'engine/typed';
import {assert} from 'utils/assert';

export class Component extends Typed {
    constructor() {
        super();
        this.valid = true;
        this.entity = null;
        this._ = this.name;
    }

    get ecsContext() {
        assert(this.entity != null);
        assert(this.entity.ecsContext != null);
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
        return this.type == ctor.type;
    }

    onAdd(entity) {
        assert(entity.ecsContext != null);
        this.entity = entity;
    }

    onRemove(entity) {
        assert(entity.ecsContext != null);
        this.entity = null;
    }
}

export class ArrayComponent extends Component {
    constructor(n) {
        super();
        this.fields = new Array(n);
    }

    clone() {
        return new this.constructor(...this.fields);
    }

    copyTo(dest) {
        super.copyTo(dest);
        for (let i = 0; i < this.fields.length; i++) {
            dest.fields[i] = this.fields[i];
        }
    }
}
