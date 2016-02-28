import {Hud} from './hud.js';

export const GlobalHud = {
    init() {
        let hud = document.getElementById('hud');
        let ability = document.getElementById('ability');
        let message = document.getElementById('message');
        let stats = document.getElementById('stats');
        hud.style.display = 'block';
        this.Hud = new Hud(hud, ability, message, stats);
    }
};
