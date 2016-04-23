import {GlobalDrawer} from 'global_drawer';
import {GlobalHud} from 'global_hud';
import {initTiles} from 'tiles';

import {TileDescription} from 'tile_description';

export async function initGlobals() {
    await GlobalDrawer.init();
    await initTiles(TileDescription);
    await GlobalHud.init();
}
