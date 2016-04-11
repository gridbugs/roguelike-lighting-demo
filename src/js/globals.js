import {GlobalDrawer} from 'global_drawer';
import {GlobalHud} from 'global_hud';
import {Tiles} from 'tiles';

export async function initGlobals() {
    await GlobalDrawer.init();
    await Tiles.init();
    await GlobalHud.init();
}
