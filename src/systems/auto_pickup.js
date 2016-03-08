import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class AutoPickup extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);
        this.on(Actions.Walk, (action) => {
            if (action.entity.has(Components.AutoPickup)) {
                let destination = this.getCell(action.destination);
                for (let item of destination) {
                    if (item.is(Components.Getable)) {
                        this.ecsContext.scheduleImmediateAction(
                            new Actions.Get(action.entity, item)
                        );
                    }
                }
            }
        });
    }
}
