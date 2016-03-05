import {Components} from 'components';

export class Hud {
    constructor(container, weapon, message, stats, overlay) {
        this.container = container;
        this._weapon = weapon;
        this._message = message;
        this._stats = stats;

        this._healthValue = 0;
        this._depthValue = 0;
        this._overlay = overlay;
    }

    set stats(value) {
        this._stats.innerHTML = value;
    }

    set message(value) {
        this._message.innerHTML = value;
    }

    set weapon(value) {
        this._weapon.innerHTML = value;
    }

    showOverlay() {
        this._overlay.style.display = 'block';
    }

    hideOverlay() {
        this._overlay.style.display = 'none';
    }

    set overlay(value) {
        this._overlay.innerHTML = value;
    }

    update(entity) {
        this._healthValue = entity.get(Components.Health).value;
        this._depthValue = entity.ecsContext.level.depth;
        this.stats = `LVL:${this._depthValue} HP:${this._healthValue}`;

        this.weapon = entity.get(Components.CurrentWeapon).weapon.get(Components.Name).value;
        this.message = "";
    }
}
