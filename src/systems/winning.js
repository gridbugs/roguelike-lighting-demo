import {ReactiveSystem} from 'engine/reactive_system.js';
import {Actions} from 'actions.js';
import {Components} from 'components.js';

export class Winning extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);
        this.on(Actions.Die, (action) => {
            if (action.entity.has(Components.WinOnDeath)) {
                this.ecsContext.victory = true;
            }
        });
    }
}
