import {TileStore} from 'tile_store';
import {loadImage} from 'utils/image_loader';
import {Transparent} from 'utils/colour';
import {Config} from 'config';

export const Tiles = {};

Tiles.init = async function() {

    const tileStore = new TileStore(Config.TILE_WIDTH, Config.TILE_HEIGHT);

    // characters
    this.PlayerCharacter = tileStore.allocateCharacterTile('@', '#000000');
    this.Zombie = tileStore.allocateCharacterTile('Z', '#3f3e0b');
    this.Skeleton = tileStore.allocateCharacterTile('S', '#444444');
    this.Bloat = tileStore.allocateCharacterTile('B', '#9a4500');

    this.PileOfBones = tileStore.allocateImageTile(await loadImage('images/pile-of-bones.png'), true);

    this.Unseen = tileStore.allocateCharacterTile(' ', '#000000', '#000000');
    this.Target = tileStore.allocateImageTile(await loadImage('images/target.png'), true);
    this.Path = tileStore.allocateImageTile(await loadImage('images/path.png'), true);

    this.WallTop = tileStore.allocateImageTile(await loadImage('images/wall-top.png'));
    this.WallFront = tileStore.allocateImageTile(await loadImage('images/wall-front.png'));
    this.WindowTop = tileStore.allocateImageTile(await loadImage('images/window-top.png'));
    this.WindowFront = tileStore.allocateImageTile(await loadImage('images/window-front.png'));
    this.Floor = tileStore.allocateDotTile(4, '#b08c4c', '#d4b888');
    this.Void = tileStore.allocateCharacterTile(' ', '#000000', '#00003b');

    this.Stars0 = tileStore.allocateImageTile(await loadImage('images/stars-0.png'));
    this.Stars1 = tileStore.allocateImageTile(await loadImage('images/stars-1.png'));
    this.Stars2 = tileStore.allocateImageTile(await loadImage('images/stars-2.png'));
    this.Stars3 = tileStore.allocateImageTile(await loadImage('images/stars-3.png'));

    this.Teleport0 = tileStore.allocateImageTile(await loadImage('images/teleport-0.png'), true);
    this.Teleport1 = tileStore.allocateImageTile(await loadImage('images/teleport-1.png'), true);
    this.Teleport2 = tileStore.allocateImageTile(await loadImage('images/teleport-2.png'), true);
    this.Teleport3 = tileStore.allocateImageTile(await loadImage('images/teleport-3.png'), true);

    this.HealthKit = tileStore.allocateImageTile(await loadImage('images/healthkit.png'), true);

    this.Pistol = tileStore.allocateImageTile(await loadImage('images/pistol.png'), true);
    this.Shotgun = tileStore.allocateImageTile(await loadImage('images/shotgun.png'), true);
    this.MachineGun = tileStore.allocateImageTile(await loadImage('images/machinegun.png'), true);
    this.Flamethrower = tileStore.allocateImageTile(await loadImage('images/flamethrower.png'), true);
    this.RocketLauncher = tileStore.allocateImageTile(await loadImage('images/rocket-launcher.png'), true);

    this.Bullet = tileStore.allocateImageTile(await loadImage('images/bullet.png'), true);
    this.Rocket = tileStore.allocateImageTile(await loadImage('images/rocket.png'), true);
    this.Fireball = tileStore.allocateImageTile(await loadImage('images/fireball.png'), true);
    this.Door = tileStore.allocateImageTile(await loadImage('images/door.png'), true);
    this.OpenDoor = tileStore.allocateImageTile(await loadImage('images/door-open.png'), true);
    this.DownStairs = tileStore.allocateImageTile(await loadImage('images/down-stairs.png'));
    this.UpStairs = tileStore.allocateImageTile(await loadImage('images/up-stairs.png'), true);
    this.FireBackground = tileStore.allocateImageTile(await loadImage('images/fire-background.png'), true);

    this.WaterAnimationTiles = [
        tileStore.allocateImageTile(await loadImage('images/water-0.png')),
        tileStore.allocateImageTile(await loadImage('images/water-1.png')),
    ];

    this.TeleportAnimationTiles = [
        this.Teleport0,
        this.Teleport1,
        this.Teleport2,
        this.Teleport3
    ];

    this.VacuumOverlay = tileStore.allocateSquareTile('rgba(0, 0, 255, 0.3');
    this.PressureWallOverlay = tileStore.allocateSquareTile('rgba(0, 255, 0, 0.3');
    this.VentingOverlay = tileStore.allocateSquareTile('rgba(255, 0, 0, 0.3');

    this.HealthBarSize = 8;
    this.HealthBars = [];
    for (var i = 0; i <= this.HealthBarSize; ++i) {
        this.HealthBars[i] = tileStore.allocateImageTile(await loadImage(`images/health-bar-${i}.png`), true);
    }

    // debugging tiles
    this.debugArray = [];
    for (var i = 0; i <= 9; ++i) {
        this.debugArray.push(tileStore.allocateCharacterTile('' + i, '#000000', 'rgba(255, 255, 255, 0.25)'));
    }
    for (var i = 0; i < 26; ++i) {
        var c = String.fromCharCode('a'.charCodeAt(0) + i);
        this.debugArray.push(tileStore.allocateCharacterTile(c, '#000000', 'rgba(255, 255, 255, 0.25)'));
    }
    for (var i = 0; i < 26; ++i) {
        var c = String.fromCharCode('A'.charCodeAt(0) + i);
        this.debugArray.push(tileStore.allocateCharacterTile(c, '#000000', 'rgba(255, 255, 255, 0.25)'));
    }
    this.debugExtra = tileStore.allocateCharacterTile('?', '#000000', 'rgba(255, 255, 255, 0.25)');
}

Tiles.getDebug = function(i) {
    let tile = this.debugArray[i];
    if (tile === undefined) {
        return this.debugExtra;
    }
    return tile;
}
