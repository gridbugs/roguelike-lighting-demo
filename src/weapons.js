import {EntityPrototypes} from 'entity_prototypes';
import {Actions} from 'actions';

import {ControlTypes} from 'control';

import {CellGrid, Cell} from 'utils/cell_grid';
import {Directions} from 'utils/direction';
import {Stack} from 'utils/stack';
import {getRandomInt} from 'utils/random';
import {Line} from 'utils/line';

import {Config} from 'config';

const spreadGrid = new (CellGrid(Cell))(Config.GRID_WIDTH, Config.GRID_HEIGHT);
const spreadStack = new Stack();

class Gun {
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
            let projectile = entity.ecsContext.emplaceEntity(
                EntityPrototypes.Bullet(trajectory.startCoord.x, trajectory.startCoord.y)
            );
            entity.ecsContext.scheduleImmediateAction(
                new Actions.FireProjectile(entity, projectile, trajectory),
                delay
            );
            delay += this.timeBetweenShot;
        }
    }
}

Gun.prototype.use = async function(entity) {
    var line = await entity.ecsContext.pathPlanner.getLine(entity.cell.coord, ControlTypes.Fire);
    if (line === null) {
        return null;
    }

    this.scheduleBullets(entity, line);

    return new Actions.FireGun(entity);
}

export class Pistol extends Gun {
    constructor() {
        super();
        this.bulletSpread = 1 / 8;
        this.burstSize = 1;
        this.timeBetweenShot = 0;
    }
}

export class Shotgun extends Gun {
    constructor() {
        super();
        this.bulletSpread = 1 / 3;
        this.burstSize = 6;
        this.timeBetweenShot = 0;
    }
}

export class MachineGun extends Gun {
    constructor() {
        super();
        this.bulletSpread = 1 / 5;
        this.burstSize = 6;
        this.timeBetweenShot = 20;
    }
}

