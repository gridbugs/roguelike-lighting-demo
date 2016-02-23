import {Actions} from './actions.js';
import {Direction} from './direction.js';
import {Components} from './components.js';
import {EntityPrototypes} from './entity_prototypes.js';
import {makeEnum, substituteValues, makeTable} from './enum.js';
import * as Input from './input.js';

export const ControlTypes = makeEnum([
    'West',
    'South',
    'North',
    'East',
    'NorthWest',
    'NorthEast',
    'SouthWest',
    'SouthEast',
    'CloseDoor',
    'Fire',
    'Wait'
], true);

export const ControlKeys = substituteValues(ControlTypes, {
    h: 'West',
    j: 'South',
    k: 'North',
    l: 'East',
    y: 'NorthWest',
    u: 'NorthEast',
    b: 'SouthWest',
    n: 'SouthEast',
    c: 'CloseDoor',
    f: 'Fire',
    a: 'Wait'
});

function closeDoor(entity) {
    for (let neighbour of entity.cell.neighbours) {
        let door = neighbour.find(Components.Door);
        if (door !== null && door.get(Components.Door).open) {
            return new Actions.CloseDoor(entity, door);
        }
    }
    return null;
}

async function useAbility(entity) {
    var ability = entity.get(Components.CurrentAbility).ability;
    entity.ecsContext.scheduleImmediateAction(
        new Actions.TakeDamage(entity, ability.cost)
    );
    return await ability.use(entity);
}

export const ControlTable = makeTable(ControlTypes, {
    West:       (entity) => { return new Actions.Walk(entity, Direction.West) },
    South:      (entity) => { return new Actions.Walk(entity, Direction.South) },
    North:      (entity) => { return new Actions.Walk(entity, Direction.North) },
    East:       (entity) => { return new Actions.Walk(entity, Direction.East) },
    NorthWest:  (entity) => { return new Actions.Walk(entity, Direction.NorthWest) },
    NorthEast:  (entity) => { return new Actions.Walk(entity, Direction.NorthEast) },
    SouthWest:  (entity) => { return new Actions.Walk(entity, Direction.SouthWest) },
    SouthEast:  (entity) => { return new Actions.Walk(entity, Direction.SouthEast) },
    CloseDoor:  closeDoor,
    Fire:       useAbility,
    Wait:       (entity) => { return new Actions.Wait(entity) }
});

export function controlFromChar(character) {
    let control = ControlTable[ControlKeys[character]];
    if (control !== undefined) {
        return control;
    }
    return null;
}

export function controlTypeFromKey(key) {
    if (Input.isCharKey(key)) {
        let type = ControlKeys[Input.getCharFromKey(key)];
        if (type === undefined) {
            return null;
        }
        return type;
    }
    return null;
}
