import {ReactiveSystem} from './reactive_system.js';
import {Actions} from './actions.js';
import {Components} from './components.js';

export class Fire extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);
        this.entities = new Set();

        this.on(Actions.ProjectileCollide, (action) => {
            if (action.entity.is(Components.FireStarter)) {
                if (action.contact.is(Components.Flamable)) {
                    this.ecsContext.scheduleImmediateAction(
                            new Actions.CatchFire(action.contact));
                }
                if (action.contact.is(Components.Meltable)) {
                    this.ecsContext.scheduleImmediateAction(
                            new Actions.Melt(action.contact));
                }
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
            if (entity.cell.has(Components.Water)) {
                this.ecsContext.scheduleImmediateAction(
                        new Actions.Extinguish(entity));
            } else {
                this.ecsContext.scheduleImmediateAction(
                        new Actions.Burn(entity, timeDelta));
            }
        }
    }
}
