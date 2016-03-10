import {Drawer} from 'drawer';
import {Config} from 'config';

export const GlobalDrawer = {
    init() {
        this.Drawer = new Drawer(
            document.getElementById('canvas'),
            Config.TILE_WIDTH,
            Config.TILE_HEIGHT
        );
        if (Config.DEBUG) {
            let canvas = document.createElement('canvas');
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
            canvas.id = 'debug-canvas';

            this.DebugDrawer = new Drawer(
                canvas,
                Config.TILE_WIDTH,
                Config.TILE_HEIGHT
            );
        }

    }
}
