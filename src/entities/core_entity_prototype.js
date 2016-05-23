import {Components} from 'components';
import {Tiles} from 'tiles';
import {EntityPrototypes} from 'entity_prototypes';
import {bit} from 'utils/bit';
import {degreesToRadians as d2r} from 'utils/angle';
import {Lighthouse} from 'lighthouse';

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
        new Components.Tile(Tiles.WoodWall, 2),
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
        new Components.Tile(Tiles.Window, 2),
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

const LIGHTHOUSE_CHANNEL = 0;

export function LighthouseWall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.LighthouseWall, 2),
        new Components.Opacity(1),
        new Components.Solid(),
        new Components.LightMask(~bit(LIGHTHOUSE_CHANNEL)),
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
        new Components.Tile(Tiles.Lamp, 2),
        new Components.DirectionalLight(30, 4, d2r(90), d2r(30), bit(LIGHTHOUSE_CHANNEL)),
        new Components.TurnTaker(new Lighthouse()),
    ];
}
