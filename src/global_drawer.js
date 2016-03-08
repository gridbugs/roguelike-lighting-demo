import {Drawer} from 'drawer';
import {Config} from 'config';

export const GlobalDrawer = {
    init() {
        this.Drawer = new Drawer(
            document.getElementById('canvas'),
            Config.TILE_WIDTH,
            Config.TILE_HEIGHT
        );
        this.DebugDrawer = new Drawer(
            document.getElementById('debug-canvas'),
            Config.TILE_WIDTH,
            Config.TILE_HEIGHT
        );

    }
}
