import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class Bullets extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);
        this.on(Actions.ProjectileCollide, (action) => {
            if (action.entity.is(Components.Bullet)) {
                this.ecsContext.scheduleImmediateAction(
                        new Actions.GetShot(action.contact, action.entity, action.trajectory));
            }
        });
    }
}
