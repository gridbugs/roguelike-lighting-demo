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
