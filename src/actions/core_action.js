import {Action} from 'engine/action';
import {Components} from 'components';
import {MAX_OPACITY, opacityFromFloat} from 'vision';

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
    constructor(character, door) {
        super();
        this.character = character;
        this.door = door;
    }

    commit() {
        this.door.get(Components.Door).open = true;
        this.door.get(Components.Tile).tile = this.door.get(Components.Door).openTile;
        this.door.get(Components.Opacity).value = 0;
        this.door.remove(Components.Solid);
        this.door.cell.recompute();
    }
}

export class CloseDoor extends Action {
    constructor(character, door) {
        super();
        this.character = character;
        this.door = door;
    }

    commit() {
        this.door.get(Components.Door).open = false;
        this.door.get(Components.Tile).tile = this.door.get(Components.Door).closedTile;
        this.door.get(Components.Opacity).value = MAX_OPACITY;
        this.door.add(new Components.Solid());
        this.door.cell.recompute();
    }
}
