import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class Collision extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Walk, (action) => {
            let destination = this.getCell(action.destination);

            if (destination === null) {
                action.success = false;
                return;
            }

            if (action.entity.is(Components.Collider) &&
                destination.is(Components.Solid)) {

                action.success = false;
            }

            if (destination.is(Components.Void)) {
                this.ecsContext.scheduleImmediateAction(
                    new Actions.FallIntoSpace(action.entity)
                );
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

            if (action.entity.has(Components.Combatant) &&
                destination.has(Components.Combatant)) {

                action.success = false;
                let target = destination.find(Components.Combatant);
                if (target.get(Components.Combatant).group !==
                    action.entity.get(Components.Combatant).group) {
                    this.ecsContext.scheduleImmediateAction(
                            new Actions.MeleeAttack(action.entity, target));
                }
            }
        });

        this.on(Actions.ProjectileStep, (action) => {
            let destination = this.getCell(action.destination);
            if (action.entity.is(Components.Projectile)) {
                if (destination.is(Components.Solid)) {

                    action.success = false;
                    let contact = destination.find(Components.Solid);
                    this.ecsContext.scheduleImmediateAction(
                            new Actions.ProjectileCollide(action.entity, contact, action.trajectory));
                } else if (destination.has(Components.Combatant)) {

                    action.success = false;
                    let contact = destination.find(Components.Combatant);
                    this.ecsContext.scheduleImmediateAction(
                            new Actions.ProjectileCollide(action.entity, contact, action.trajectory));
                }
            }
        });

        this.on(Actions.Knockback, (action) => {
            let destination = this.getCell(action.destination);
            if (destination === null) {
                action.success = false;
                return;
            }

            if (action.entity.is(Components.Collider) &&
                destination.is(Components.Solid)) {
                action.success = false;
            }

            if (action.entity.has(Components.Combatant) &&
                destination.has(Components.Combatant)) {
                action.success = false;
            }

            if (destination.is(Components.Void)) {
                this.ecsContext.scheduleImmediateAction(
                    new Actions.FallIntoSpace(action.entity)
                );
            }
        });

        this.on(Actions.Vent, (action) => {
            let destination = this.getCell(action.destination);
            if (destination === null) {
                action.success = false;
                return;
            }

            if (action.entity.is(Components.Collider) &&
                destination.is(Components.Solid)) {
                action.success = false;
            }

            if (action.entity.has(Components.Combatant) &&
                destination.has(Components.Combatant)) {
                action.success = false;
            }

            if (destination.is(Components.Void)) {
                this.ecsContext.scheduleImmediateAction(
                    new Actions.FallIntoSpace(action.entity)
                );
            }
        });
    }
}
