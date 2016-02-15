import {Typed} from './type.js';

export class Action extends Typed {
    constructor() {
        super();
        this.success = true;
    }
}
