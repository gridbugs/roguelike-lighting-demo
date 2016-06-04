import {Font} from 'tiles/font';
import {Effect} from 'effect';
import {Colour, rgb, rgba} from 'colour';
import {CharacterTile, SolidTile, DotTile, ImageTile} from 'tiles/tile_types';

const IBM_BIOS = new Font("IBM-BIOS", 16, 1, -2);
const DOT_SIZE = 4;

export const TileDescription = {
    PlayerCharacter:    new CharacterTile('@', IBM_BIOS, Colour.White),
    Ground:             new DotTile(DOT_SIZE, '#124400', '#041600'),
    StoneFloor:         new DotTile(DOT_SIZE, '#222222', '#444444'),
    WoodWall:           new CharacterTile('#', IBM_BIOS, '#332301', '#664602'),
    WoodWallTop:        new ImageTile('images/wood-wall-top.png', false),
    WoodWallFront:      new ImageTile('images/wood-wall-front.png', false),
    WoodWindowTop:      new ImageTile('images/wood-window-top.png', false),
    WoodWindowFront:    new ImageTile('images/wood-window-front.png', false),
    LighthouseWallTop:      new ImageTile('images/lighthouse-wall-top.png', false),
    LighthouseWallFront:    new ImageTile('images/lighthouse-wall-front.png', false),
    LighthouseWindowTop:    new ImageTile('images/lighthouse-window-top.png', false),
    LighthouseWindowFront:  new ImageTile('images/lighthouse-window-front.png', false),
    LighthouseFloor:    new DotTile(DOT_SIZE, '#222222', '#444444'),
    Window:             new CharacterTile('#', IBM_BIOS, '#ffffff', '#50e7d4'),
    ClosedWoodenDoor:   new ImageTile('images/door-closed.png', true),
    OpenWoodenDoor:     new ImageTile('images/door-open.png', true),
    Tree:               new ImageTile('images/pine-tree.png', true),
    Water:              new CharacterTile('~', IBM_BIOS, '#2288cc', '#004488'),
    Rock:               new CharacterTile('*', IBM_BIOS, '#222222', '#444444'),
    Lamp:               new CharacterTile('£', IBM_BIOS, '#cccc00'),
    Unknown:            new SolidTile(Colour.Black),
    OutOfBounds:        new SolidTile(Colour.Black),
    NoTile:             new SolidTile('#ff0000'),
    Bullet:             new DotTile(8, '#888888'),
    PlasmaRound:        new ImageTile('images/plasma-round.png', true),
    GreenLight:         new SolidTile(rgba(0, 255, 0, 0.2), true, new Set([Effect.TransparencyLevels])),
    RedLight:           new SolidTile(rgba(255, 0, 0, 0.2), true, new Set([Effect.TransparencyLevels])),
    YellowLight:        new SolidTile(rgba(255, 255, 0, 0.2), true, new Set([Effect.TransparencyLevels])),
    CyanLight:          new SolidTile(rgba(0, 255, 255, 0.2), true, new Set([Effect.TransparencyLevels]))
};
