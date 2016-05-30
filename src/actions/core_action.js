import {Action} from 'engine/action';
import * as Change from 'engine/change';
import {Components} from 'components';
import {normalize} from 'utils/angle';
import {Direction} from 'utils/direction';
import {Vec2} from 'utils/vec2';
import {EntityPrototypes} from 'entity_prototypes';

export class Walk extends Action {
    constructor(entity, direction) {
        super();
        this.entity = entity;
        this.direction = direction;
        this.position = this.entity.get(Components.Position);
        this.source = this.position.vector;
        this.destination = this.source.add(this.direction.vector);
    }

    getChanges() {
        return [
            new Change.UpdateComponentFieldInPlace(
                this.entity,
                Components.Position,
                Components.Position.Vector,
                (vector) => {
                    vector.set(this.destination)
                }
            ),
        ];
    }
}

export class OpenDoor extends Action {
    constructor(character, door) {
        super();
        this.character = character;
        this.door = door;
        this.entity = door;
    }

    getChanges() {
        return [
            new Change.SetComponentField(this.door, Components.Door, Components.Door.Open, true),
            new Change.SetComponentField(this.door, Components.Tile, Components.Tile.Family,
                this.door.get(Components.Door).openTileFamily),
            new Change.SetComponentField(this.door, Components.Opacity, Components.Opacity.Value, 0),
            new Change.RemoveComponent(this.door, Components.Solid),
        ];
    }
}

export class CloseDoor extends Action {
    constructor(character, door) {
        super();
        this.character = character;
        this.door = door;
        this.entity = door;
    }

    getChanges() {
        return [
            new Change.SetComponentField(this.door, Components.Door, Components.Door.Open, false),
            new Change.SetComponentField(this.door, Components.Tile, Components.Tile.Family,
                this.door.get(Components.Door).closedTileFamily),
            new Change.SetComponentField(this.door, Components.Opacity, Components.Opacity.Value, 1),
            new Change.AddComponent(this.door, Components.Solid),
        ];
    }
}

export class DirectionalLightTurn extends Action {
    constructor(entity, angle) {
        super();
        this.entity = entity;
        this.angle = angle;
    }

    getChanges() {
        return [
            new Change.SetComponentField(this.entity, Components.DirectionalLight,
                     Components.DirectionalLight.Angle,
                     normalize(this.entity.get(Components.DirectionalLight).angle + this.angle))
        ];
    }
}

export class Wait extends Action {
    constructor(entity) {
        super();
        this.entity = entity;
    }

    getChanges() {
        return [];
    }
}

export class Shoot extends Action {
    constructor(entity, count = 5) {
        super();
        this.direction = Direction.North;
        this.entity = entity;
        this.origin = entity.get(Components.Position).vector;
        this.count = count;
    }

    getChanges() {
        const BULLET = 0;
        const MUZZLE_FLASH = 1;

        return [
            new Change.Bind(BULLET, new Change.AddEntity(EntityPrototypes.Bullet(this.origin.x, this.origin.y))),
            new Change.Refer(BULLET, (bullet) => new Change.AddComponent(bullet, Components.Velocity, this.direction.vector)),
            new Change.Refer(BULLET, (bullet) => new Change.AddComponent(bullet, Components.Animated)),
            new Change.Bind(MUZZLE_FLASH, new Change.AddEntity(EntityPrototypes.MuzzleFlash(this.origin.x, this.origin.y, this.direction.vector.angleYFlipped))),
            new Change.Refer(MUZZLE_FLASH, (muzzleFlash) => new Change.AddComponent(muzzleFlash, Components.Animated)),
        ];
    }
}

export class VelocityMove extends Action {
    constructor(entity) {
        super();
        this.entity = entity;
        this.position = this.entity.get(Components.Position);
        this.velocity = this.entity.get(Components.Velocity);
        this.source = this.position.vector;
        this.destination = this.source.add(this.velocity.vector);
    }

    getChanges() {
        return [
            new Change.UpdateComponentFieldInPlace(
                this.entity,
                Components.Position,
                Components.Position.Vector,
                (vector) => {
                    vector.set(this.destination)
                }
            ),
        ];
    }
}

export class Destroy extends Action {
    constructor(entity) {
        super();
        this.entity = entity;
    }

    getChanges() {
        return [
            new Change.RemoveEntity(this.entity)
        ];
    }
}
