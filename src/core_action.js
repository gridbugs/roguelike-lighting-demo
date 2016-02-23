import {Action} from './action.js';
import {Components} from './components.js';

export class Walk extends Action {
    constructor(entity, direction) {
        super();
        this.entity = entity;
        this.direction = direction;
        this.position = this.entity.get(Components.Position);
        this.source = this.position.vector;
        this.destination = this.source.add(this.direction.vector);
    }

    commit() {
        this.position.vector = this.destination;
    }
}

export class Wait extends Action {
    constructor(entity) {
        super();
        this.entity = entity;
    }

    commit() {

    }
}

export class OpenDoor extends Action {
    constructor(entity, door) {
        super();
        this.entity = entity;
        this.door = door;
    }

    commit() {
        this.door.with(Components.Door, (door) => {
            door.open = true;
        });
    }
}

export class CloseDoor extends Action {
    constructor(entity, door) {
        super();
        this.entity = entity;
        this.door = door;
    }

    commit() {
        this.door.with(Components.Door, (door) => {
            door.open = false;
        });
    }
}

export class FireProjectile extends Action {
    constructor(entity, projectile, trajectory) {
        super();
        this.entity = entity;
        this.projectile = projectile;
        this.trajectory = trajectory.absoluteCoords();
    }

    commit(ecsContext) {
        let next = this.trajectory.next();
        if (next.done) {
            ecsContext.scheduleImmediateAction(
                new ProjectileTerminate(this.projectile)
            );
        } else {
            ecsContext.scheduleImmediateAction(
                new ProjectileStep(this.projectile, this.trajectory, next.value)
            );
        }
    }
}

export class ProjectileStep extends Action {
    constructor(entity, trajectory, destination) {
        super();
        this.entity = entity;
        this.trajectory = trajectory;
        this.destination = destination;
    }

    commit(ecsContext) {
        this.entity.get(Components.Position).vector = this.destination;
        let next = this.trajectory.next();
        if (next.done) {
            ecsContext.scheduleImmediateAction(
                new ProjectileTerminate(this.entity),
                10
            );
        } else {
            ecsContext.scheduleImmediateAction(
                new ProjectileStep(this.entity, this.trajectory, next.value),
                10
            );
        }
    }
}

export class ProjectileTerminate extends Action {
    constructor(entity) {
        super();
        this.entity = entity;
    }

    commit(ecsContext) {
        ecsContext.removeEntity(this.entity);
    }
}

export class ProjectileCollide extends Action {
    constructor(entity, contact) {
        super();
        this.entity = entity;
        this.contact = contact;
    }

    commit(ecsContext) {
        ecsContext.removeEntity(this.entity);
    }
}

export class MeleeAttack extends Action {
    constructor(attacker, target) {
        super();
        this.attacker = attacker;
        this.target = target;
    }

    commit(ecsContext) {}
}

export class MeleeAttackHit extends Action {
    constructor(attacker, target, damage) {
        super();
        this.attacker = attacker;
        this.target = target;
        this.damage = damage;
    }

    commit(ecsContext) {
        ecsContext.scheduleImmediateAction(
            new TakeDamage(this.target, this.damage)
        );
    }
}

export class TakeDamage extends Action {
    constructor(entity, damage) {
        super();
        this.entity = entity;
        this.damage = damage;
    }

    commit(ecsContext) {
        this.entity.with(Components.Health, (health) => {
            health.value -= this.damage;
            if (health.value <= 0) {
                ecsContext.scheduleImmediateAction(
                    new Die(this.entity)
                );
            }
        });
    }
}

export class Die extends Action {
    constructor(entity) {
        super();
        this.entity = entity;
    }

    commit(ecsContext) {
        this.entity.get(Components.TurnTaker).nextTurn.enabled = false;
        ecsContext.removeEntity(this.entity);
    }
}

export class CatchFire extends Action {
    constructor(entity) {
        super();
        this.entity = entity;
    }

    commit(ecsContext) {
        this.entity.with(Components.Flamable, (flamable) => {
            this.entity.add(new Components.Burning(flamable.time));
        });
    }
}

export class Burn extends Action {
    constructor(entity, time) {
        super();
        this.entity = entity;
        this.time = time;
    }

    commit(ecsContext) {
        this.entity.with(Components.Burning, (burning) => {
            burning.time -= this.time;
            if (this.entity.has(Components.Health)) {
                ecsContext.scheduleImmediateAction(
                    new TakeDamage(this.entity, this.time)
                );
            }
            if (burning.time <= 0) {
                if (this.entity.has(Components.Health)) {
                    this.entity.remove(Components.Burning);
                } else {
                    ecsContext.removeEntity(this.entity);
                }
            }
        });
    }
}
