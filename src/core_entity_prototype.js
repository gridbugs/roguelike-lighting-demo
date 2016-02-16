import {EntityPrototype} from './entity_prototype.js';
import {Components} from './components.js';
import {Tiles} from './tiles.js';

import {playerTakeTurn} from './player_control.js';
import * as Shadowcast from './shadowcast.js';

export function PlayerCharacter(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PlayerCharacter, 2),
        new Components.TurnTaker(playerTakeTurn),
        new Components.Collider(),
        new Components.PlayerCharacter(),
        new Components.Observer(Shadowcast.detectVisibleAreas)
    ];
}

export function Wall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WallFront, Tiles.WallTop, 1),
        new Components.Solid()
    ];
}

export function Tree(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Tree, 1),
        new Components.Solid()
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
