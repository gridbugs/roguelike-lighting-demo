import {Components} from 'components';
import {Tiles} from 'tiles';
import {EntityPrototypes} from 'entity_prototypes';
import {bit} from 'utils/bit';
import {degreesToRadians as d2r, radiansToDegrees as r2d} from 'utils/angle';
import {Lighthouse} from 'lighthouse';
import {ALL_CHANNELS} from 'lighting';
import {rgba32, rgba32FloatAlpha} from 'utils/rgba32';
import {Rgb24Colours} from 'utils/colour';

export function Tree(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Tree, 2),
        new Components.Opacity(0.49),
        new Components.Solid()
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
        new Components.WallTile(Tiles.WoodWallFront, Tiles.WoodWallTop, 2),
        new Components.Opacity(1),
        new Components.Solid()
    ];
}

export function ClosedWoodenDoor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.ClosedWoodenDoor, 2),
        new Components.Opacity(1),
        new Components.Door(false, Tiles.OpenWoodenDoor, Tiles.ClosedWoodenDoor),
        new Components.Solid()
    ];
}

export function Window(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WoodWindowFront, Tiles.WoodWindowTop, 2),
        new Components.Solid()
    ];
}

export function Lamp(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Lamp, 2),
        new Components.Light(30, 4)
    ];
}

export function GreenLamp(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Lamp, 2),
        new Components.Light(30, 4, ALL_CHANNELS, rgba32FloatAlpha(0, 255, 0, 0.2)),
    ];
}

export function RedLamp(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Lamp, 2),
        new Components.Light(30, 4, ALL_CHANNELS, rgba32FloatAlpha(255, 0, 0, 0.2)),
    ];
}

const LIGHTHOUSE_CHANNEL = 0;

export function LighthouseWall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.LighthouseWallFront, Tiles.LighthouseWallTop, 2),
        new Components.Opacity(1),
        new Components.Solid(),
    ];
}

export function LighthouseFloor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.LighthouseFloor, 1),
        new Components.LightMask(~bit(LIGHTHOUSE_CHANNEL)),
    ];
}

export function LighthouseLamp(x, y) {
    return [
        new Components.Position(x, y),
        new Components.DirectionalLight(30, 4, d2r(90), d2r(30), bit(LIGHTHOUSE_CHANNEL),
                                        rgba32FloatAlpha(255, 255, 0, 0.2)),
        new Components.TurnTaker(new Lighthouse()),
    ];
}

export function LighthouseWindow(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.LighthouseWindowFront, Tiles.LighthouseWindowTop, 2),
        new Components.Solid()
    ];
}

export function Bullet(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Bullet, 3),
        new Components.Bullet(),
    ];
}

export function PlasmaRound(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PlasmaRound, 3),
        new Components.Bullet(),
        new Components.Light(40, 2, ALL_CHANNELS, rgba32FloatAlpha(0, 255, 255, 0.3))
    ];
}

export function MuzzleFlash(x, y, direction) {
    const WIDTH = d2r(60);
    return [
        new Components.Position(x, y),
        new Components.DirectionalLight(30, 4, direction, WIDTH),
        new Components.Flash(),
    ];
}
