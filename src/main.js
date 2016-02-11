import './populate_namespaces.js';

import {TileStore} from './tile_store.js';
import {loadImage} from './image_loader.js';

import {drawer} from './singleton_drawer.js';

export async function main() {

    var ts = new TileStore(20, 20);

    ts.setFont('ps2p', 16, false, false);
    ts.yOffset = 2;

    var a = ts.allocateCharacterTile('A');

    ts.fontBold = true;
    ts.updateFont();

    var b = ts.allocateCharacterTile('A', 'red', 'rgba(0,0,0,0)');
    var c = ts.allocateCharacterTile('@', 'white', 'black');
    var d = ts.allocateImage(await loadImage('images/wall-front.png'));
    var e = ts.allocateCharacterTile('b', 'black', 'white');
    var f = ts.allocateCharacterTile('.', 'white', 'black');
    var g = ts.allocateImage(await loadImage('images/wall-top.png'));

    drawer.drawTile(a, 10, 20);
    drawer.drawTile(b, 100, 50);

    drawer.drawTile(g, 0, 0);
    drawer.drawTile(g, 60, 0);
    drawer.drawTile(g, 0, 20);
    drawer.drawTile(g, 60, 20);
    drawer.drawTile(d, 0, 40);
    drawer.drawTile(d, 60, 40);

    drawer.drawTile(d, 20, 0);
    drawer.drawTile(d, 40, 0);

    drawer.drawTile(f, 20, 40);
    drawer.drawTile(f, 40, 40);
    drawer.drawTile(c, 20, 20);
    drawer.drawTile(f, 40, 20);
}
