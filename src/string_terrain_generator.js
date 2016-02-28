import {EntityPrototypes} from './entity_prototypes.js';
import {Components} from './components.js';
import {Level} from './level.js';

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

        for (let i = 0; i < this.stringArray.length; ++i) {
            let string = this.stringArray[i];
            for (let j = 0; j < string.length; ++j) {
                let character = string[j];
                this.addEntities(ecsContext, character, j, i);
            }
        }
    }

    addEntities(ecs, character, x, y) {

        let add = (name) => {
            return ecs.emplaceEntity(EntityPrototypes[name](x, y));
        }

        switch (character) {
        case '&':
            if (Math.random() < 0.1) {
                add('DeadTree');
            } else {
                add('Tree');
            }
            add('Ground');
            break;
        case '.':
            add('IceFloor');
            break;
        case ',':
            add('StoneFloor');
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
            add('WoodenDoor');
            add('Ground');
            break;
        case '-':
            add('OpenWoodenDoor');
            add('Ground');
            break;
        case ' ':
            add('Ground');
            break;
        case '#':
            add('IceWall');
            add('IceFloor');
            break;
        case '~':
            add('Water');
            add('IceFloor');
            break;
        case '%':
            add('BrickWall');
            add('IceFloor');
            break;
        case '@':
            add('PlayerCharacter');
            add('IceFloor');
            break;
        case 'c':
            add('SpiderChild');
            if (this.nextStringArray === null) {
                add('StoneFloor');
            } else {
                add('IceFloor');
            }
            break;
        }
    }
}
