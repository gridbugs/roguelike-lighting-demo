import {Actions} from 'actions';
import {Direction} from 'utils/direction';
import {Components} from 'components';
import {EntityPrototypes} from 'entity_prototypes';
import {makeEnum, substituteValues, makeTable} from 'utils/enum';
import * as Input from 'utils/input';
import {Turn} from 'engine/turn';

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
    'Down',
    'Examine',
    'Help'
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
    '>': 'Down',
    x: 'Examine',
    '?': 'Help'
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

async function useWeapon(entity) {
    var weapon = entity.get(Components.CurrentWeapon).weapon.get(Components.Weapon).weapon;
    var action = await weapon.use(entity);
    return action;
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

async function examine(entity) {
    var hud = entity.ecsContext.hud;
    var grid = entity.get(Components.Observer).knowledge.getGrid(entity.ecsContext);
    var result = await entity.ecsContext.pathPlanner.getCoord(entity.cell.coord, ControlTypes.Examine, (coord) => {
        var cell = grid.get(coord);
        hud.message = "";
        if (!cell.topEntityMemory.empty) {
            var topEntity = cell.topEntityMemory.best;
            topEntity.with(Components.Name, (name) => {
                hud.message = name.value;
            });
        }
    });
    hud.message = "";
    if (result !== null) {
        var cell = grid.get(result);
        if (!cell.topEntityMemory.empty) {
            var topEntity = cell.topEntityMemory.best;
            var text = null;
            var description = topEntity.get(Components.Description);
            if (description === null) {
                var name = topEntity.get(Components.Name);
                text = name.value;
            } else {
                text = description.value;
            }
            if (text !== null) {
                hud.overlay = text;
                hud.showOverlay();
                await Input.getNonModifierKey();
                hud.hideOverlay();
            }
        }
    }
    return null;
}

export async function help(entity) {
    var hud = entity.ecsContext.hud;
    hud.overlay = [
        '',
        'Press any key to start!',
        '',
        '',
        'Movement: hjklyubn',
        'Wait: .',
        'Ascend: <',
        'Descend: >',
        'Fire: f, movement keys to navigate, enter to fire',
        'Open/Close: c',
        'Examine: x, movement keys to nagivate, enter for more details',
        'Show this screen: ?'
    ]
        .map((x) => {return `<p>${x}</p>`})
        .join('<br/>');

    hud.showOverlay();
    await Input.getNonModifierKey();
    hud.hideOverlay();

    return null;
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
    Fire:       useWeapon,
    Wait:       (entity) => { return new Actions.Wait(entity) },
    Up:         maybeUp,
    Down:       maybeDown,
    Examine:    examine,
    Help:       help
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
