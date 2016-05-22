import {Action} from 'engine/action';
import * as Change from 'engine/change';
import {Components} from 'components';
import {normalize} from 'utils/angle';

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
