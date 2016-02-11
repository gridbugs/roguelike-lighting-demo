import {Typed} from './type.js';
export class Component extends Typed {
    constructor(...args) {
        super();
        this.valid = true;
    }

    /* Turns dest into a copy of this */
    copyTo(dest) {
        dest.valid = this.valid;
    }

    clone() {
        let ret = new this.constructor();
        this.copyTo(ret);
        return ret;
    }
}
