import {TileStore} from './tile_store.js';
import {loadImage} from './image_loader.js';
import {Transparent} from './colour.js';
import {Config} from './config.js';

export const Tiles = {};

Tiles.init = async function() {

    const tileStore = new TileStore(Config.TILE_WIDTH, Config.TILE_HEIGHT);

    // characters
    this.PlayerCharacter = tileStore.allocateCharacterTile('@', '#ffffff');
    this.SpiderChild = tileStore.allocateCharacterTile('c', '#95b9c7');


    this.IceFloor = tileStore.allocateDotTile(4, '#224488', '#000022');
    this.StoneFloor = tileStore.allocateDotTile(4, '#888888', '#220000');
    this.Unseen = tileStore.allocateCharacterTile(' ', '#000000', '#000000');
    this.Target = tileStore.allocateImageTile(await loadImage('images/target.png'), true);
    this.Path = tileStore.allocateImageTile(await loadImage('images/path.png'), true);

    if (Config.ASCII) {
        this.IceWallFront = tileStore.allocateCharacterTile('#', '#888888', '#000000');
        this.IceWallTop = tileStore.allocateCharacterTile('#', '#888888', '#000000');
        this.BrickWallFront = tileStore.allocateCharacterTile('#', '#888888', '#000000');
        this.BrickWallTop = tileStore.allocateCharacterTile('#', '#888888', '#000000');
        this.Tree = tileStore.allocateCharacterTile('&', 'green');
        this.DeadTree = tileStore.allocateCharacterTile('&', '#774e16');
        this.Door = tileStore.allocateCharacterTile('+', '#ffffff');
        this.OpenDoor = tileStore.allocateCharacterTile('-', '#ffffff');
        this.DownStairs = tileStore.allocateCharacterTile('>', '#ffffff');
        this.UpStairs = tileStore.allocateCharacterTile('<', '#ffffff');
        this.Fireball = tileStore.allocateCharacterTile('*', '#ff8800');
        this.FireBackground = tileStore.allocateSquareTile('#ff8800');
    } else {
        this.BrickWallTop = tileStore.allocateImageTile(await loadImage('images/brick-wall-top.png'));
        this.BrickWallFront = tileStore.allocateImageTile(await loadImage('images/brick-wall-front.png'));
        this.IceWallTop = tileStore.allocateImageTile(await loadImage('images/ice-wall-top.png'));
        this.IceWallFront = tileStore.allocateImageTile(await loadImage('images/ice-wall-front.png'));
        this.Tree = tileStore.allocateImageTile(await loadImage('images/pine-tree.png'), true);
        this.DeadTree = tileStore.allocateImageTile(await loadImage('images/dead-tree.png'), true);
        this.Door = tileStore.allocateImageTile(await loadImage('images/door.png'), true);
        this.OpenDoor = tileStore.allocateImageTile(await loadImage('images/door-open.png'), true);
        this.DownStairs = tileStore.allocateImageTile(await loadImage('images/down-stairs.png'));
        this.UpStairs = tileStore.allocateImageTile(await loadImage('images/up-stairs.png'), true);
        this.Fireball = tileStore.allocateImageTile(await loadImage('images/fireball.png'), true);
        this.FireBackground = tileStore.allocateImageTile(await loadImage('images/fire-background.png'), true);
    }

    this.HealthBarSize = 8;
    this.HealthBars = [];
    for (var i = 0; i <= this.HealthBarSize; ++i) {
        this.HealthBars[i] = tileStore.allocateImageTile(await loadImage(`images/health-bar-${i}.png`), true);
    }

    if (Config.DEBUG) {
        this.debugArray = [];
        for (var i = 0; i <= 9; ++i) {
            this.debugArray.push(tileStore.allocateCharacterTile('' + i, '#000000', 'rgba(255, 255, 255, 0.25)'));
        }
        for (var i = 0; i < 26; ++i) {
            var c = String.fromCharCode('a'.charCodeAt(0) + i);
            this.debugArray.push(tileStore.allocateCharacterTile(c, '#000000', 'rgba(255, 255, 255, 0.25)'));
        }
        for (var i = 0; i < 26; ++i) {
            var c = String.fromCharCode('A'.charCodeAt(0) + i);
            this.debugArray.push(tileStore.allocateCharacterTile(c, '#000000', 'rgba(255, 255, 255, 0.25)'));
        }
        this.debugExtra = tileStore.allocateCharacterTile('?', '#000000', 'rgba(255, 255, 255, 0.25)');
    }
}

Tiles.getDebug = function(i) {
    let tile = this.debugArray[i];
    if (tile === undefined) {
        return this.debugExtra;
    }
    return tile;
}
