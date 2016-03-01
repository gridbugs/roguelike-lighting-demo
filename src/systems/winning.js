import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

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
