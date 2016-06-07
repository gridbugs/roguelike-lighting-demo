import {Config} from 'config';
import {SpriteDrawer} from 'drawing/sprite_drawer';
import {ColourDrawer} from 'drawing/colour_drawer';
import {Renderer} from 'drawing/renderer';
import {getCanvasContextById} from 'utils/canvas';

export const GlobalDrawer = {
    init() {
        let background = new SpriteDrawer(getCanvasContextById('background-canvas'),
                Config.TILE_WIDTH, Config.TILE_HEIGHT);
        let foreground = new SpriteDrawer(getCanvasContextById('foreground-canvas'),
                Config.TILE_WIDTH, Config.TILE_HEIGHT);
        let lighting = new ColourDrawer(getCanvasContextById('lighting-canvas'),
                Config.TILE_WIDTH, Config.TILE_HEIGHT);

        this.Renderer = new Renderer(
            Config.GRID_WIDTH,
            Config.GRID_HEIGHT,
            background,
            foreground,
            lighting
        );
    }
}
