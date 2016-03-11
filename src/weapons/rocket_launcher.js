import {Weapon} from 'weapon';
import {Directions} from 'utils/direction';
import {Actions} from 'actions';
import {Line} from 'utils/line';
import {Gun, AmmoReductionType} from 'weapons/guns';

export class RocketLauncher extends Gun {
    constructor() {
        super();
        this.maxAmmo = 10;
        this.ammo = 0;
        this.bulletSpread = 1 / 16;
        this.burstSize = 1;
        this.timeBetweenShot = 0;
        this.ammoReduction = AmmoReductionType.PerShot;
        this.FireActionType = Actions.FireRocket;
        this.range = 100;
    }
}

RocketLauncher.prototype.use = async function(entity) {
    var line = await this.getLine(entity);

    if (line === null) {
        return null;
    }

    if (line.point) {
        return null;
    }

    this.scheduleBullets(entity, line);

    return new Actions.FireGun(entity, this);
}
