import {Action} from 'engine/action';
import * as Change from 'engine/change';
import {Components} from 'components';

export class Walk extends Action {
    constructor(entity, direction) {
        super();
        this.entity = entity;
        this.direction = direction;
        this.position = this.entity.get(Components.Position);
        this.source = this.position.vector;
        this.destination = this.source.add(this.direction.vector);
    }

    changes() {
        return [
            new Change.UpdateComponentFieldInPlace(
                this.entity,
                Components.Position,
                Components.Position.Field.Vector,
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

    changes() {
        return [
            new Change.SetComponentField(this.door, Components.Door, Components.Door.Field.Open, true),
            new Change.SetComponentField(this.door, Components.Tile, Components.Tile.Field.Family,
                this.door.get(Components.Door).openTileFamily),
            new Change.SetComponentField(this.door, Components.Opacity, Components.Opacity.Field.Value, 0),
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

    changes() {
        return [
            new Change.SetComponentField(this.door, Components.Door, Components.Door.Field.Open, false),
            new Change.SetComponentField(this.door, Components.Tile, Components.Tile.Field.Family,
                this.door.get(Components.Door).closedTileFamily),
            new Change.SetComponentField(this.door, Components.Opacity, Components.Opacity.Field.Value, 1),
            new Change.AddComponent(this.door, Components.Solid),
        ];
    }
}
