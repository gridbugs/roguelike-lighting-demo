import {System} from 'engine/system';
import {Actions} from 'actions';

export class ReactiveSystem extends System {
    constructor(ecsContext) {
        super(ecsContext);

        this.width = this.spacialHash.width;
        this.height = this.spacialHash.height;

        this.actionTable = new Array(Actions.length);
        for (let i = 0; i < Actions.length; ++i) {
            this.actionTable[i] = null;
        }
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
