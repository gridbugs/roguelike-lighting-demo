import {Components} from './components.js';

export class Hud {
    constructor(element) {
        this.element = element;
    }

    set health(value) {
        this.element.innerHTML = value;
    }

    update(entity) {
        this.health = entity.get(Components.Health).value;
    }
}
