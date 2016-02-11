import {Typed} from './type.js';
export class Component extends Typed {
    constructor(...args) {
        super();
        this._ = this.name;
        this.valid = true;
    }

    /* Turns dest into a copy of this */
    copyTo(dest) {
        dest.valid = this.valid;
    }
}
