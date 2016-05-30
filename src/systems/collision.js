import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class Collision extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Walk, (action) => {
            let destination = this.getCell(action.destination);

            if (destination == null) {
                action.success = false;
                return;
            }

            if (action.entity.is(Components.Collider) &&
                destination.is(Components.Solid)) {
                action.success = false;
            }

            if (action.entity.is(Components.Bullet) &&
                destination.is(Components.Solid)) {
                action.success = false;
            }

        });

        this.on(Actions.VelocityMove, (action) => {
            let destination = this.getCell(action.destination);

            if (destination == null) {
                action.success = false;
                if (action.entity.is(Components.Bullet)) {
                    this.ecsContext.scheduleAction(new Actions.Destroy(action.entity));
                }
                return;
            }


            if (action.entity.is(Components.Bullet) &&
                destination.is(Components.Solid)) {
                action.success = false;
                this.ecsContext.scheduleAction(new Actions.Destroy(action.entity));
            }

        });
    }
}
