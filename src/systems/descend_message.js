import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class DescendMessage extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Descend, (action) => {
            if (!action.force && action.stairs.get(Components.DownStairs).upStairs === null) {
                this.ecsContext.hud.message = "Climbing down the stairs...";
                this.ecsContext.drawer.clear();
                action.success = false;
                /* Schedule a copy of the action to run after the message is displayed */
                this.ecsContext.scheduleImmediateAction(
                    new Actions.Descend(action.entity, action.stairs, true /* force */)
                );
            }
        });
    }
}
