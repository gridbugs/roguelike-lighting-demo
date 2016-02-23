import {Typed} from './type.js';

export class System extends Typed {
    constructor(ecsContext) {
        super();
        this.ecsContext = ecsContext;
        this.spacialHash = this.ecsContext.spacialHash;
    }

    getCell(x, y) {
        return this.spacialHash.get(x, y);
    }
}
