import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class AutoClimb extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);
        this.on(Actions.Walk, (action) => {
            if (action.entity.has(Components.AutoClimb)) {
                let destination = this.getCell(action.destination);
                if (destination.has(Components.DownStairs)) {
                    let stairs = destination.find(Components.DownStairs);
                    this.ecsContext.scheduleImmediateAction(
                        new Actions.Descend(action.entity, stairs),
                        100
                    );
                }
                if (destination.has(Components.UpStairs)) {
                    let stairs = destination.find(Components.UpStairs);
                    this.ecsContext.scheduleImmediateAction(
                        new Actions.Ascend(action.entity, stairs),
                        100
                    );
                }
            }
        });
    }
}
