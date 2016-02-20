import {Turn} from './turn.js';

export class Controller {
    constructor() {
        this.entity = null;
    }

    takeTurn() {
        return new Turn(this.getAction());
    }
}
