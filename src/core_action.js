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
