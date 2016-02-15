import {Action} from './action.js';
import {Components} from './components.js';

export class Walk extends Action {
    constructor(entity, direction) {
        super();
        this.entity = entity;
        this.direction = direction;
    }

    commit() {
        let position = this.entity.get(Components.Position);
        let destination = position.vector.add(this.direction.vector);
        position.vector = destination;
    }
}
