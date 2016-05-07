import {Components} from 'components';
import {Tiles} from 'tiles';
import {Weapons} from 'weapons';
import {EntityPrototypes} from 'entity_prototypes';
import {MAX_OPACITY, opacityFromFloat} from 'vision';

export function Tree(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Tree, 2),
        new Components.Opacity(opacityFromFloat(0.49))
    ];
}

export function Ground(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Ground, 1)
    ];
}

export function Water(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Water, 1)
    ];
}

export function Rock(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Rock, 2)
    ];
}

export function StoneFloor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.StoneFloor, 1)
    ];
}

export function WoodWall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.WoodWall, 2),
        new Components.Opacity(MAX_OPACITY)
    ];
}

export function ClosedWoodenDoor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.ClosedWoodenDoor, 2),
        new Components.Opacity(MAX_OPACITY)
    ];
}

export function Window(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Window, 2)
    ];
}

export function Lamp(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Lamp, 2),
        new Components.Light(30, 4)
    ];
}
