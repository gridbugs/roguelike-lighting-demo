import {TileStore} from './tile_store.js';
import {loadImage} from './image_loader.js';
import {Config} from './config.js';

const TILE_WIDTH = Config.TILE_WIDTH;
const TILE_HEIGHT = Config.TILE_HEIGHT;
const TILE_FONT_FACE = 'ps2p';
const TILE_FONT_SIZE = 16;

const tileStore = new TileStore(TILE_WIDTH, TILE_HEIGHT);

export const Tiles = {};

Tiles.init = async function() {
    tileStore.setFont(TILE_FONT_FACE, TILE_FONT_SIZE, false, false);

    this.PlayerCharacter = tileStore.allocateCharacterTile('@', '#000000', TileStore.transparent);
    this.Floor = tileStore.allocateCharacterTile('.', '#ffffff', '#000000');
    this.WallFront = tileStore.allocateImage(await loadImage('images/wall-front.png'));
    this.WallTop = tileStore.allocateImage(await loadImage('images/wall-top.png'));
    this.Tree = tileStore.allocateCharacterTile('&', '#44aa11', TileStore.transparent);
}
