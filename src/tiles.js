import {TileStore} from './tile_store.js';
import {loadImage} from './image_loader.js';
import {Transparent} from './colour.js';
import {Config} from './config.js';

const TILE_WIDTH = Config.TILE_WIDTH;
const TILE_HEIGHT = Config.TILE_HEIGHT;
const TILE_FONT_FACE = 'IBM-BIOS';
const TILE_FONT_SIZE = 16;

const tileStore = new TileStore(TILE_WIDTH, TILE_HEIGHT);

export const Tiles = {};

Tiles.init = async function() {
    tileStore.setFont(TILE_FONT_FACE, TILE_FONT_SIZE, false, false);

    this.PlayerCharacter = tileStore.allocateCharacterTile('@', '#ffffff');
    this.Floor = tileStore.allocateDotTile(4, '#224488', '#000022');
    if (Config.ASCII) {
        this.WallFront = tileStore.allocateCharacterTile('#', '#888888', '#000000');
        this.WallTop = tileStore.allocateCharacterTile('#', '#888888', '#000000');
        this.Tree = tileStore.allocateCharacterTile('&', 'green', 'black');
    } else {
        this.WallTop = tileStore.allocateImage(await loadImage('images/ice-wall-top.png'));
        this.WallFront = tileStore.allocateImage(await loadImage('images/ice-wall-front.png'));
        this.Tree = tileStore.allocateImage(await loadImage('images/pine-tree.png'), true);
    }
}
