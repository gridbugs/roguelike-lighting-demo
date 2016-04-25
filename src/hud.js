import {Components} from 'components';

export class Hud {
    constructor(container, weapon, message, stats, atmosphere, overlay) {
        this.container = container;
        this._weapon = weapon;
        this._message = message;
        this._stats = stats;
        this._atmosphere = atmosphere;
        this._overlay = overlay;

        this.messageChanged = false;
    }

    show() {
        this.container.style.display = 'block';
    }

    hide() {
        this.container.style.display = 'none';
    }

    set stats(value) {
        this._stats.innerHTML = value;
    }

    set message(value) {
        this.messageChanged = true;
        this._message.innerHTML = value;
    }

    set weapon(value) {
        this._weapon.innerHTML = value;
    }

    set atmosphere(value) {
        this._atmosphere.innerHTML = value;
    }

    showOverlay() {
        this.hide();
        this._overlay.style.display = 'block';
    }

    hideOverlay() {
        this.show();
        this._overlay.style.display = 'none';
    }

    set overlay(value) {
        this._overlay.innerHTML = value;
    }

    update(entity) {
    }

}
