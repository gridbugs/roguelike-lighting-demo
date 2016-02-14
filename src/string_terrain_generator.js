import {EntityPrototypes} from './entity_prototypes.js';

export class StringTerrainGenerator {
    constructor(stringArray) {
        this.stringArray = stringArray;
    }

    generate(ecsContext) {
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
            ecs.emplaceEntity(EntityPrototypes[name](x, y));
        }

        switch (character) {
        case '&':
            add('Tree');
            add('Ground');
            break;
        case '.':
        case ',':
        case '+':
        case '>':
            add('Floor');
            break;
        case ' ':
            add('Ground');
            break;
        case '#':
        case '%':
            add('Wall');
            add('Floor');
            break;
        case '@':
            add('PlayerCharacter');
            add('Floor');
            break;
        }
    }
}
