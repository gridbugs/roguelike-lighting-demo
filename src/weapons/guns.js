import {EntityPrototypes} from 'entity_prototypes';
import {Actions} from 'actions';

import {ControlTypes} from 'control';

import {CellGrid, Cell} from 'utils/cell_grid';
import {Directions} from 'utils/direction';
import {Stack} from 'utils/stack';
import {getRandomInt} from 'utils/random';
import {Line} from 'utils/line';
import {makeEnum} from 'utils/enum';

import {Config} from 'config';
import {Weapon} from 'weapon';

const spreadGrid = new (CellGrid(Cell))(Config.GRID_WIDTH, Config.GRID_HEIGHT);
const spreadStack = new Stack();

export const AmmoReductionType = makeEnum([
    'PerShot',
    'PerBurst'
]);

class Gun extends Weapon {

    constructor() {
        super();
        this.ammo = 0;
    }

    addAmmoFromWeapon(weapon) {
        let originalAmmo = this.ammo;
        this.ammo = Math.min(this.ammo + weapon.ammo, this.maxAmmo);
        let ammoDiff = this.ammo - originalAmmo;
        weapon.ammo -= ammoDiff;
    }

    *trajectories(line) {
        spreadStack.clear();
        let startCell = spreadGrid.get(line.endCoord);
        let spreadWidth = this.bulletSpread * line.length;
        for (let cell of startCell.floodFill(Directions, spreadWidth)) {
            spreadStack.push(cell);
        }
        for (let i = 0; i < this.burstSize; ++i) {
            let endCoord = spreadStack.array[getRandomInt(0, spreadStack.length)];
            let trajectory = new Line(line.startCoord, endCoord);
            yield trajectory;
        }
    }

    scheduleBullets(entity, line) {
        let delay = 0;
        for (let trajectory of this.trajectories(line)) {
            entity.ecsContext.scheduleImmediateAction(
                new Actions.FireBullet(entity, this, trajectory),
                delay
            );
            if (this.ammoReduction === AmmoReductionType.PerShot) {
                entity.ecsContext.scheduleImmediateAction(
                    new Actions.ReduceAmmo(entity, this),
                    delay
                );
            }
            delay += this.timeBetweenShot;
        }
        if (this.ammoReduction === AmmoReductionType.PerBurst) {
            entity.ecsContext.scheduleImmediateAction(
                new Actions.ReduceAmmo(entity, this),
                delay - this.timeBetweenShot
            );
        }
    }
}

Gun.prototype.use = async function(entity) {
    var line = await entity.ecsContext.pathPlanner.getLine(entity.cell.coord, ControlTypes.Fire);
    if (line === null) {
        return null;
    }

    this.scheduleBullets(entity, line);

    return new Actions.FireGun(entity, this);
}

export class Pistol extends Gun {
    constructor() {
        super();
        this.maxAmmo = 100;
        this.bulletSpread = 1 / 8;
        this.burstSize = 1;
        this.timeBetweenShot = 0;
        this.ammoReduction = AmmoReductionType.PerShot;
    }
}

export class Shotgun extends Gun {
    constructor() {
        super();
        this.maxAmmo = 50;
        this.bulletSpread = 1 / 3;
        this.burstSize = 6;
        this.timeBetweenShot = 0;
        this.ammoReduction = AmmoReductionType.PerBurst;
    }
}

export class MachineGun extends Gun {
    constructor() {
        super();
        this.maxAmmo = 200;
        this.bulletSpread = 1 / 5;
        this.burstSize = 6;
        this.timeBetweenShot = 20;
        this.ammoReduction = AmmoReductionType.PerShot;
    }
}

