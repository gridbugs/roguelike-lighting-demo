import {Components} from 'components';
import {Tiles} from 'tiles';
import {Weapons} from 'weapons';

export function Wall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WallFront, Tiles.WallTop, 1),
        new Components.Solid(),
        new Components.Opacity(1),
        new Components.Name("Wall")
    ];
}

export function Window(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WindowFront, Tiles.WindowTop, 1),
        new Components.Solid(),
        new Components.Name("Window")
    ];
}

export function Door(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Door, 1),
        new Components.Door(false, Tiles.OpenDoor, Tiles.Door),
        new Components.Opacity(1),
        new Components.Solid(),
        new Components.Name("Door")
    ];
}

export function Floor(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Floor, 0),
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

export function Void(x, y) {
    return [
        new Components.Position(x, y),
        new Components.RandomlyChosenTile({
            Void: 20,
            Stars0: 1,
            Stars1: 1,
            Stars2: 1,
            Stars3: 1,
        }, 0),
        new Components.Name("Nothing")
    ];
}

export function Bullet(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Bullet, 3),
        new Components.Projectile(),
        new Components.Name("Bullet"),
        new Components.Bullet()
    ];
}

export function Pistol(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Pistol, 2),
        new Components.Weapon(new Weapons.Pistol()),
        new Components.Name("Pistol"),
        new Components.Description("A pistol. Basic small armament. Simple and reliable.")
    ];
}

export function Shotgun(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Shotgun, 2),
        new Components.Weapon(new Weapons.Shotgun()),
        new Components.Name("Shotgun"),
        new Components.Description("A shotgun. Keep it handy for close encounters.")
    ];
}

export function MachineGun(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.MachineGun, 2),
        new Components.Weapon(new Weapons.MachineGun()),
        new Components.Name("Machine Gun"),
        new Components.Description("A machine gun. Good for putting holes in things.")
    ];
}
