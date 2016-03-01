import {Components} from 'components.js';
import {Tiles} from 'tiles.js';

export function IceWall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.IceWallFront, Tiles.IceWallTop, 1),
        new Components.Solid(),
        new Components.Opacity(0.5),
        new Components.Meltable(),
        new Components.Name("Ice Wall")
    ];
}

export function BrickWall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.BrickWallFront, Tiles.BrickWallTop, 1),
        new Components.Solid(),
        new Components.Opacity(1),
        new Components.Name("Brick Wall")
    ];
}

export function Tree(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Tree, 1),
        new Components.Solid(),
        new Components.Opacity(0.5),
        new Components.Flamable(5),
        new Components.Name("Tree")
    ];
}

export function DeadTree(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.DeadTree, 1),
        new Components.Solid(),
        new Components.Opacity(0.25),
        new Components.Flamable(2),
        new Components.Name("Dead Tree")
    ];
}

export function WoodenDoor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Door, 1),
        new Components.Door(false, Tiles.OpenDoor, Tiles.Door),
        new Components.Opacity(1),
        new Components.Solid(),
        new Components.Flamable(4),
        new Components.Name("Door")
    ];
}

export function OpenWoodenDoor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.OpenDoor, 1),
        new Components.Door(true, Tiles.OpenDoor, Tiles.Door),
        new Components.Opacity(0),
        new Components.Flamable(4),
        new Components.Name("Door")
    ];
}

export function IceFloor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.IceFloor, 0),
        new Components.Name("Floor")
    ];
}

export function StoneFloor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.StoneFloor, 0),
        new Components.Name("Floor")
    ];
}

export function Ground(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.IceFloor, 0),
        new Components.Name("Floor")
    ];
}

export function Fireball(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Fireball, 3),
        new Components.Projectile(),
        new Components.FireStarter(),
        new Components.Name("FireBall")
    ];
}

export function DownStairs(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.DownStairs, 1),
        new Components.DownStairs(),
        new Components.Name("Downwards Staircase")
    ];
}

export function UpStairs(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.UpStairs, 1),
        new Components.UpStairs(),
        new Components.Name("Upwards Staircase")
    ];
}

export function Water(x, y) {
    return [
        new Components.Position(x, y),
        new Components.RandomlyAnimatedTile(Tiles.WaterAnimationTiles,
                /* depth */ 2, /* min time */ 0, /* max time */ 3),
        new Components.Water(),
        new Components.Name("Water")
    ];
}

export function CollapsedUpStairs(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.CollapsedUpStairs, 1),
        new Components.Name("Collapsed Staircase")
    ];
}

export function CathedralDownStairs(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.CathedralDownStairs, 1),
        new Components.DownStairs(),
        new Components.Name("Staircase to Cathedral")
    ];
}
