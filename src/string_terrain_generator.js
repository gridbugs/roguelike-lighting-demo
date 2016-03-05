import {EntityPrototypes} from 'entity_prototypes';
import {Components} from 'components';
import {Level} from 'engine/level';
import {Config} from 'config';

export class StringTerrainGenerator {
    constructor(depth, stringArray, nextStringArray = null) {
        this.depth = depth;
        this.stringArray = stringArray;
        this.nextStringArray = nextStringArray;
        this.stairsFromAbove = null;
        this.aboveLevel = null;
    }

    addStairsFromAbove(stairs) {
        this.stairsFromAbove = stairs;
    }

    generate(level, ecsContext) {

        if (this.nextStringArray !== null) {
            this.nextGenerator = new StringTerrainGenerator(this.depth + 1, this.nextStringArray)
            this.nextGenerator.aboveLevel = level;
            this.nextLevel = new Level(this.nextGenerator);
        }

        for (let i = 0; i < Config.GRID_HEIGHT; ++i) {
            for (let j = 0; j < Config.GRID_WIDTH; ++j) {
                let ch = ' ';
                if (this.stringArray[i]) {
                    if (this.stringArray[i][j]) {
                        ch = this.stringArray[i][j];
                    }
                }
                this.addEntities(ecsContext, ch, j, i);
            }
        }
    }

    addEntities(ecs, character, x, y) {

        let add = (name) => {
            return ecs.emplaceEntity(EntityPrototypes[name](x, y));
        }

        switch (character) {
        case '.':
            add('Floor');
            break;
        case '>': {
            let stairs = add('DownStairs');
            stairs.get(Components.DownStairs).level = this.nextLevel;
            this.nextGenerator.addStairsFromAbove(stairs);
            add('IceFloor');
            break;
        }
        case '<': {
            let stairs = add('UpStairs');
            stairs.get(Components.UpStairs).level = this.aboveLevel;
            stairs.get(Components.UpStairs).downStairs = this.stairsFromAbove;
            this.stairsFromAbove.get(Components.DownStairs).upStairs = stairs;
            if (this.nextStringArray === null) {
                add('StoneFloor');
            } else {
                add('IceFloor');
            }
            break;
        }
        case '+':
            add('Door');
            add('Floor');
            break;
        case ' ':
            add('Void');
            break;
        case '~':
            add('Water');
            add('Floor');
            break;
        case '#':
        case '%':
            add('Wall');
            add('Floor');
            break;
        case '=':
            add('Window');
            add('Floor');
            break;
        case 'z':
            add('Zombie');
            add('Floor');
            break;
        case '1':
            add('Pistol').get(Components.Weapon).weapon.ammo = 20;
            add('Floor');
            break;
        case '2':
            add('Shotgun').get(Components.Weapon).weapon.ammo = 20;
            add('Floor');
            break;
        case '3':
            add('MachineGun').get(Components.Weapon).weapon.ammo = 200;
            add('Floor');
            break;
        case '4':
            add('Flamethrower').get(Components.Weapon).weapon.ammo = 20;
            add('Floor');
            break;
        case '@': {
            let pc = add('PlayerCharacter');
            let gun = add('Flamethrower');
            gun.get(Components.Weapon).weapon.ammo = 40;
            pc.get(Components.WeaponInventory).addWeapon(gun);
            gun.remove(Components.Position);
            add('Floor');
            break;
        }
        }
    }
}
