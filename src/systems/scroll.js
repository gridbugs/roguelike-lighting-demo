import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';
import {Config} from 'config';

export class Scroll extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Walk, (action) => {
            if (!action.success) {
                return;
            }
            console.debug(action.destination);
            console.debug(ecsContext.level.width, ecsContext.level.height);
        });
    }
}
