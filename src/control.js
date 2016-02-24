import {Actions} from './actions.js';
import {Direction} from './direction.js';
import {Components} from './components.js';
import {EntityPrototypes} from './entity_prototypes.js';
import {makeEnum, substituteValues, makeTable} from './enum.js';
import * as Input from './input.js';
import {Turn} from './turn.js';

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
    'Wait',
    'Up',
    'Down'
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
    '.': 'Wait',
    '<': 'Up',
    '>': 'Down'
});

function toggleDoor(entity) {
    for (let neighbour of entity.cell.neighbours) {
        let door = neighbour.find(Components.Door);
        if (door !== null && door.get(Components.Door).open) {
            return new Actions.CloseDoor(entity, door);
        }
    }
    for (let neighbour of entity.cell.neighbours) {
        let door = neighbour.find(Components.Door);
        if (door !== null && door.get(Components.Door).closed) {
            return new Actions.OpenDoor(entity, door);
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

function maybeUp(entity) {
    let action = null;
    entity.cell.withEntity(Components.UpStairs, (stairs) => {
        action = new Turn(new Actions.Ascend(entity, stairs), 1, false /* no reschedule */);
    });
    return action;
}

function maybeDown(entity) {
    let action = null;
    entity.cell.withEntity(Components.DownStairs, (stairs) => {
        action = new Turn(new Actions.Descend(entity, stairs), 1, false /* no reschedule */);
    });
    return action;
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
    CloseDoor:  toggleDoor,
    Fire:       useAbility,
    Wait:       (entity) => { return new Actions.Wait(entity) },
    Up:         maybeUp,
    Down:       maybeDown
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
