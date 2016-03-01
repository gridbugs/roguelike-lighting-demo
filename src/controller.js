import {Turn} from 'engine/turn';
import {Components} from 'components';

export class Controller {
    constructor() {
        this.entity = null;
    }

    takeTurn() {
        return new Turn(this.getAction(), this.entity.get(Components.WalkTime).value);
    }
}
