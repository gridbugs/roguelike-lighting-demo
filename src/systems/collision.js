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

            if (action.entity.is(Components.Collider) &&
                destination.has(Components.Door)) {
                for (let entity of destination) {
                    if (entity.is(Components.Door) && entity.get(Components.Door).closed) {
                        action.success = false;
                        this.ecsContext.scheduleImmediateAction(
                                new Actions.OpenDoor(action.entity, entity));
                        break;
                    }
                }
            }
        });
    }
}
