import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

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

        this.on(Actions.ProjectileStep, (action) => {
            if (action.entity.is(Components.FireStarter)) {
                for (let entity of action.entity.cell) {
                    if (entity.is(Components.Flamable)) {
                        this.ecsContext.scheduleImmediateAction(
                                new Actions.CatchFire(entity));
                    }
                }
            }
        });
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
