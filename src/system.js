import {Actions} from './actions.js';
import {Typed} from './type.js';

export class System extends Typed {
    constructor(ecsContext) {
        super();
        this.ecsContext = ecsContext;
        this.spacialHash = this.ecsContext.spacialHash;

        this.width = this.spacialHash.width;
        this.height = this.spacialHash.height;

        this.actionTable = new Array(Actions.length);
        for (let i = 0; i < Actions.length; ++i) {
            this.actionTable[i] = null;
        }
    }

    getCell(x, y) {
        return this.spacialHash.get(x, y);
    }

    on(actionClass, f) {
        this.actionTable[actionClass.type] = f;
    }

    run(action) {
        let f = this.actionTable[action.type];
        if (f !== null) {
            f(action);
        }
    }
}
