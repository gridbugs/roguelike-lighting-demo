import {Hud} from 'hud';

export const GlobalHud = {
    init() {
        let hud = document.getElementById('hud');
        let weapon = document.getElementById('weapon');
        let message = document.getElementById('message');
        let stats = document.getElementById('stats');
        let overlay = document.getElementById('overlay');
        hud.style.display = 'block';
        this.Hud = new Hud(hud, weapon, message, stats, overlay);
    }
};
