import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class Teleport extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Walk, (action) => {
            if (!action.success) {
                return;
            }
            let destination = this.getCell(action.destination);

            if (destination.has(Components.Teleport)) {
                this.ecsContext.scheduleImmediateAction(
                    new Actions.Win(action.entity),
                    200
                );
            }
        });
    }
}
