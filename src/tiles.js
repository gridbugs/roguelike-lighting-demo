import {TileStore} from './tile_store.js';
import {loadImage} from './image_loader.js';
import {Transparent} from './colour.js';
import {Config} from './config.js';

export const Tiles = {};

Tiles.init = async function() {

    const tileStore = new TileStore(Config.TILE_WIDTH, Config.TILE_HEIGHT);

    this.PlayerCharacter = tileStore.allocateCharacterTile('@', '#ffffff');
    this.Floor = tileStore.allocateDotTile(4, '#224488', '#000022');
    this.Unseen = tileStore.allocateCharacterTile(' ', '#000000', '#000000');

    if (Config.ASCII) {
        this.WallFront = tileStore.allocateCharacterTile('#', '#888888', '#000000');
        this.WallTop = tileStore.allocateCharacterTile('#', '#888888', '#000000');
        this.Tree = tileStore.allocateCharacterTile('&', 'green');
        this.DeadTree = tileStore.allocateCharacterTile('&', '#774e16');
        this.Door = tileStore.allocateCharacterTile('+', '#ffffff');
        this.OpenDoor = tileStore.allocateCharacterTile('-', '#ffffff');
    } else {
        this.WallTop = tileStore.allocateImage(await loadImage('images/ice-wall-top.png'));
        this.WallFront = tileStore.allocateImage(await loadImage('images/ice-wall-front.png'));
        this.Tree = tileStore.allocateImage(await loadImage('images/pine-tree.png'), true);
        this.DeadTree = tileStore.allocateImage(await loadImage('images/dead-tree.png'), true);
        this.Door = tileStore.allocateImage(await loadImage('images/door.png'), true);
        this.OpenDoor = tileStore.allocateImage(await loadImage('images/door-open.png'), true);
    }
}
