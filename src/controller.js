import {Turn} from 'engine/turn.js';
import {Components} from 'components.js';

export class Controller {
    constructor() {
        this.entity = null;
    }

    takeTurn() {
        return new Turn(this.getAction(), this.entity.get(Components.WalkTime).value);
    }
}
