import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class Shooting extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Shoot, (action) => {
            if (action.count > 0) {
                this.ecsContext.scheduleAction(new Actions.Shoot(action.entity, action.count - 1), 4);
            }
        });
    }
}
