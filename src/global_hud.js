import {Hud} from './hud.js';

export const GlobalHud = {
    init() {
        let hud = document.getElementById('hud');
        let ability = document.getElementById('ability');
        let message = document.getElementById('message');
        let health = document.getElementById('health');
        hud.style.display = 'block';
        this.Hud = new Hud(hud, ability, message, health);
    }
};
