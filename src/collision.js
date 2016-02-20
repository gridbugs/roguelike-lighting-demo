import {System} from './system.js';
import {Actions} from './actions.js';
import {Components} from './components.js';

export class Collision extends System {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Walk, (action) => {
            let destination = this.getCell(action.destination);

            if (action.entity.is(Components.Collider) &&
                destination.is(Components.Solid)) {

                action.success = false;
            }

            if (action.entity.is(Components.Collider) &&
                destination.has(Components.Door)) {
                for (let entity of destination) {
                    if (entity.is(Components.Door) && entity.get(Components.Door).closed) {
                        action.success = false;
                        this.ecsContext.scheduleImmediateAction(
                                new Actions.OpenDoor(action.entity, entity));
                        break;
                    }
                }
            }
        });

        this.on(Actions.ProjectileStep, (action) => {
            let destination = this.getCell(action.destination);
            if (action.entity.is(Components.Projectile) &&
                destination.is(Components.Solid)) {

                action.success = false;
                this.ecsContext.scheduleImmediateAction(
                        new Actions.ProjectileTerminate(action.entity));
            }
        });
    }
}
