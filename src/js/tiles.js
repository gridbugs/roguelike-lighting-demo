import {TileStore} from 'tile_store';
import {loadImage} from 'utils/image_loader';
import {Transparent} from 'utils/colour';
import {Config} from 'config';
import {resolvePromiseStructure} from 'utils/async';

export const Tiles = {};

const promiseConstructors = {
    image: (description, tileStore) => {
        return new Promise((resolve, reject) => {
            loadImage(description.image).then((image) => {
                resolve(tileStore.allocateImageTile(image, description.transparent));
            });
        });
    },
    solid: (description, tileStore) => {
        return new Promise((resolve, reject) => {
            resolve(tileStore.allocateSquareTile(description.colour));
        });
    },
    dot: (description, tileStore) => {
        return new Promise((resolve, reject) => {
            resolve(tileStore.allocateDotTile(
                        description.size, description.colour, description.backgroundColour));
        });
    },
    character: (description, tileStore) => {
        return new Promise((resolve, reject) => {
            resolve(tileStore.allocateCharacterTile(
                        description.character, description.colour, description.backgroundColour));
        });
    }
};

export async function initTiles(description) {
    const tileStore = new TileStore(Config.TILE_WIDTH, Config.TILE_HEIGHT);

    await loadTiles(description, tileStore);

    if (Config.DEBUG) {
        initDebugTiles(tileStore);
    }
}


function createTileStructure(description, tileStore) {
    let object = {};
    for (let tileName in description.tiles) {
        let tileDescription = description.tiles[tileName];
        object[tileName] = promiseConstructors[tileDescription.type](tileDescription, tileStore);
    }
    for (let groupName in description.groups) {
        let groupDescriptionArray = description.groups[groupName];
        object[groupName] = groupDescriptionArray.map(
                groupDescription => promiseConstructors[groupDescription.type](groupDescription, tileStore));
    }
    return object;
}

function loadTiles(description, tileStore) {
    let object = createTileStructure(description, tileStore);
    return resolvePromiseStructure(object, Tiles);
}

function initDebugTiles(tileStore) {
    Tiles.debugArray = [];
    for (var i = 0; i <= 9; ++i) {
        Tiles.debugArray.push(tileStore.allocateCharacterTile('' + i, '#000000', 'rgba(255, 255, 255, 0.25)'));
    }
    for (var i = 0; i < 26; ++i) {
        var c = String.fromCharCode('a'.charCodeAt(0) + i);
        Tiles.debugArray.push(tileStore.allocateCharacterTile(c, '#000000', 'rgba(255, 255, 255, 0.25)'));
    }
    for (var i = 0; i < 26; ++i) {
        var c = String.fromCharCode('A'.charCodeAt(0) + i);
        Tiles.debugArray.push(tileStore.allocateCharacterTile(c, '#000000', 'rgba(255, 255, 255, 0.25)'));
    }
    Tiles.debugExtra = tileStore.allocateCharacterTile('?', '#000000', 'rgba(255, 255, 255, 0.25)');
}

export function getDebugTile(i) {
    let tile = Tiles.debugArray[i];
    if (tile === undefined) {
        return Tiles.debugExtra;
    }
    return tile;
}
