import {Components} from 'components';
import {Tiles} from 'tiles';
import {Weapons} from 'weapons';
import {EntityPrototypes} from 'entity_prototypes';

export function Wall(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WallFront, Tiles.WallTop, 1),
        new Components.Solid(),
        new Components.Opacity(1),
        new Components.Name("Wall"),
        new Components.Breakable()
    ];
}

export function Window(x, y) {
    return [
        new Components.Position(x, y),
        new Components.WallTile(Tiles.WindowFront, Tiles.WindowTop, 1),
        new Components.Solid(),
        new Components.Name("Window"),
        new Components.Breakable()
    ];
}

export function Door(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Door, 3),
        new Components.Door(false, Tiles.OpenDoor, Tiles.Door),
        new Components.Opacity(1),
        new Components.Solid(),
        new Components.Name("Door"),
        new Components.Breakable()
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
        new Components.Name("FireBall"),
        new Components.MoveThroughCombatant()
    ];
}
export function ShockWave(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Fireball, 3),
        new Components.Projectile(),
        new Components.FireStarter(),
        new Components.Name("SockWave"),
        new Components.ShockWave()
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

export function Teleport(x, y) {
    return [
        new Components.Position(x, y),
        new Components.RandomlyAnimatedTile(Tiles.TeleportAnimationTiles,
                /* depth */ 2, /* min time */ 0, /* max time */ 0),
        new Components.Teleport(),
        new Components.Name("Teleport"),
        new Components.Description("An emergency teleporter. Teleports you off the ship, but requires so much energy that the ship will be stranded. You hope it will take you back to Earth.")
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
        new Components.Name("Nothing"),
        new Components.Void()
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

export function Rocket(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Rocket, 3),
        new Components.Projectile(),
        new Components.Name("Rocket"),
        new Components.Rocket()
    ];
}

function getWeaponInfo(name) {
    return function(entity) {
        let weapon = entity.get(Components.Weapon).weapon;
        return `${name} ${weapon.ammo}/${weapon.maxAmmo}`;
    }
}

export function Pistol(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Pistol, 2),
        new Components.Weapon(new Weapons.Pistol()),
        new Components.Getable(),
        new Components.Ventable(),
        new Components.Name(getWeaponInfo("Pistol"), "Pistol"),
        new Components.Description("A pistol. Basic small armament. Simple and reliable.")
    ];
}

export function Shotgun(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Shotgun, 2),
        new Components.Weapon(new Weapons.Shotgun()),
        new Components.Getable(),
        new Components.Ventable(),
        new Components.Name(getWeaponInfo("Shotgun"), "Shotgun"),
        new Components.Description("A shotgun. Keep it handy for close encounters.")
    ];
}

export function MachineGun(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.MachineGun, 2),
        new Components.Weapon(new Weapons.MachineGun()),
        new Components.Getable(),
        new Components.Ventable(),
        new Components.Name(getWeaponInfo("Machine Gun"), "Machine Gun"),
        new Components.Description("A machine gun. Good for putting holes in things.")
    ];
}

export function Flamethrower(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.Flamethrower, 2),
        new Components.Weapon(new Weapons.Flamethrower()),
        new Components.Getable(),
        new Components.Ventable(),
        new Components.Name(getWeaponInfo("Flamethrower"), "Flamethrower"),
        new Components.Description("A flamethrower. Considered a safe weapon for use on a ship as it can't damage the hull, but requires oxygen to function.")
    ];
}

export function RocketLauncher(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.RocketLauncher, 2),
        new Components.Weapon(new Weapons.RocketLauncher()),
        new Components.Getable(),
        new Components.Ventable(),
        new Components.Name(getWeaponInfo("Rocket Launcher"), "Rocket Launcher"),
        new Components.Description('"A rocket launcher, sir? On a spaceship?"<br/><br/><br/>"Yes marine. How else will we get rid of our surplus toxic barrels."')
    ];
}

export function HealthKit(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.HealthKit, 2),
        new Components.Getable(),
        new Components.HealthKit(10),
        new Components.Ventable(),
        new Components.Name("Health Kit"),
        new Components.Description("A Health Kit. A small box full of painkillers and adhesive medical strips.")
    ];
}

export function PileOfBones(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PileOfBones, 2),
        new Components.Ventable(),
        new Components.Name("Pile of Bones"),
        new Components.Description("The remains of a skeleton."),
        new Components.TimedTransformation(10, EntityPrototypes.Skeleton)
    ];
}
