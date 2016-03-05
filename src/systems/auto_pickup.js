import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class AutoPickup extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);
        this.on(Actions.Walk, (action) => {
            let destination = this.getCell(action.destination);
            destination.withEntity(Components.Getable, (item) => {
                this.ecsContext.scheduleImmediateAction(
                    new Actions.Get(action.entity, item)
                );
            });
        });
    }
}
