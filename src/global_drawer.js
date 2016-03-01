import {Drawer} from 'drawer.js';
import {Config} from 'config.js';

export const GlobalDrawer = {
    init() {
        this.Drawer = new Drawer(
            document.getElementById('canvas'),
            Config.TILE_WIDTH,
            Config.TILE_HEIGHT
        );
    }
}
