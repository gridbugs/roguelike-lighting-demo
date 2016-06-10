import {Drawer} from 'drawer';
import {Config} from 'config';

export const GlobalDrawer = {
    init() {
        this.Drawer = new Drawer(
            document.getElementById('game-canvas'),
            Config.TILE_WIDTH,
            Config.TILE_HEIGHT
        );
        this.UiDrawer = new Drawer(
            document.getElementById('ui-canvas'),
            Config.TILE_WIDTH,
            Config.TILE_HEIGHT
        );
        if (Config.DEBUG) {
            let canvas = document.createElement('canvas');
            canvas.width = this.Drawer.width;
            canvas.height = this.Drawer.height;
            canvas.id = 'debug-canvas';

            this.DebugDrawer = new Drawer(
                canvas,
                Config.TILE_WIDTH,
                Config.TILE_HEIGHT
            );
        }

    }
}
