import {Components} from './components.js';

export class Hud {
    constructor(container, ability, message, health) {
        this.container = container;
        this._ability = ability;
        this._message = message;
        this._health = health;
    }

    set health(value) {
        this._health.innerHTML = value;
    }

    set message(value) {
        this._message.innerHTML = value;
    }

    set ability(value) {
        this._ability.innerHTML = value;
    }

    update(entity) {
        this.health = entity.get(Components.Health).value;
        this.ability = entity.get(Components.CurrentAbility).ability.name;
        this.message = "";
    }
}
