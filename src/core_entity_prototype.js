import {EntityPrototype} from './entity_prototype.js';
import {Components} from './components.js';
import {Tiles} from './tiles.js';

export function PlayerCharacter(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PlayerCharacter, 2)
    ];
}

export function Wall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WallFront, Tiles.WallTop, 1)
    ];
}

export function Tree(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Tree, 1)
    ];
}

export function Floor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Floor, 0)
    ];
}

export function Ground(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Floor, 0)
    ];
}
