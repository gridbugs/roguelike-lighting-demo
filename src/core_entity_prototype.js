import {EntityPrototype} from './entity_prototype.js';
import {Components} from './components.js';
import {Tiles} from './tiles.js';

export function IceWall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.IceWallFront, Tiles.IceWallTop, 1),
        new Components.Solid(),
        new Components.Opacity(1)
    ];
}

export function BrickWall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.BrickWallFront, Tiles.BrickWallTop, 1),
        new Components.Solid(),
        new Components.Opacity(1)
    ];
}

export function Tree(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Tree, 1),
        new Components.Solid(),
        new Components.Opacity(0.5),
        new Components.Flamable(5)
    ];
}

export function DeadTree(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.DeadTree, 1),
        new Components.Solid(),
        new Components.Opacity(0.25),
        new Components.Flamable(2)
    ];
}

export function WoodenDoor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Door, 1),
        new Components.Door(false, Tiles.OpenDoor, Tiles.Door),
        new Components.Opacity(1),
        new Components.Solid(),
        new Components.Flamable(4)
    ];
}

export function OpenWoodenDoor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.OpenDoor, 1),
        new Components.Door(true, Tiles.OpenDoor, Tiles.Door),
        new Components.Opacity(0),
        new Components.Flamable(4)
    ];
}

export function IceFloor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.IceFloor, 0)
    ];
}

export function StoneFloor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.StoneFloor, 0)
    ];
}

export function Ground(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.IceFloor, 0)
    ];
}

export function Fireball(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Fireball, 3),
        new Components.Projectile(),
        new Components.FireStarter()
    ];
}

export function DownStairs(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.DownStairs, 1),
        new Components.DownStairs()
    ];
}

export function UpStairs(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.UpStairs, 1),
        new Components.UpStairs()
    ];
}
