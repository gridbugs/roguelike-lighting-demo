import {GlobalDrawer} from './global_drawer.js';
import {Tiles} from './tiles.js';

export async function initGlobals() {
    await GlobalDrawer.init();
    await Tiles.init();
}
