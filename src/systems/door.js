import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class Door extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Walk, (action) => {
            let destination = this.getCell(action.destination);

            if (destination === null) {
                return;
            }

            if (action.entity.is(Components.Collider) &&
                destination.has(Components.Door)) {

                let door = destination.find(Components.Door);
                if (!door.get(Components.Door).open) {
                    action.success = false;
                    this.ecsContext.scheduleImmediateAction(
                            new Actions.OpenDoor(action.entity, door));
                }

            }
        });
    }
}
