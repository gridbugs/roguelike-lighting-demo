import {Hud} from './hud.js';

export const GlobalHud = {
    init() {
        let hud = document.getElementById('hud');
        hud.style.display = 'block';
        this.Hud = new Hud(hud);
    }
};
