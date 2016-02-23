import {ReactiveSystem} from './reactive_system.js';
import {Actions} from './actions.js';
import {Components} from './components.js';

export class Fire extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);
        this.entities = new Set();

        this.on(Actions.ProjectileCollide, (action) => {
            if (action.entity.is(Components.FireStarter) &&
                action.contact.is(Components.Flamable)) {

                this.ecsContext.scheduleImmediateAction(
                        new Actions.CatchFire(action.contact));
            }
        });
    }

    add(entity) {
        this.entities.add(entity);
    }

    remove(entity) {
        this.entities.delete(entity);
    }

    progress(timeDelta) {
        for (let entity of this.entities) {
            this.ecsContext.scheduleImmediateAction(
                    new Actions.Burn(entity, timeDelta));
        }
    }
}
