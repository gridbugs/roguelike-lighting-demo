import {Actions} from 'actions';
import {Direction} from 'utils/direction';
import {Components} from 'components';
import {EntityPrototypes} from 'entity_prototypes';
import {makeEnum, substituteValues, makeTable} from 'utils/enum';
import * as Input from 'utils/input';
import {Turn} from 'engine/turn';
import {renderText, HelpText} from 'text';

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
    'Get',
    'Wait',
    'Up',
    'Down',
    'Examine',
    'NextWeapon',
    'PreviousWeapon',
    'Pistol',
    'Shotgun',
    'MachineGun',
    'Flamethrower',
    'Help'
], true);

const ControlChars = substituteValues(ControlTypes, {
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
    g: 'Get',
    w: 'PreviousWeapon',
    e: 'NextWeapon',
    1: 'Pistol',
    2: 'Shotgun',
    3: 'MachineGun',
    4: 'Flamethrower',
    '.': 'Wait',
    '<': 'Up',
    '>': 'Down',
    x: 'Examine',
    '?': 'Help'
});

const ControlNonChars = substituteValues(ControlTypes, {
    [Input.NonChar.LEFT_ARROW]: 'West',
    [Input.NonChar.RIGHT_ARROW]: 'East',
    [Input.NonChar.UP_ARROW]: 'North',
    [Input.NonChar.DOWN_ARROW]: 'South',
    [Input.NonChar.HOME]: 'NorthWest',
    [Input.NonChar.PAGE_UP]: 'NorthEast',
    [Input.NonChar.PAGE_DOWN]: 'SouthEast',
    [Input.NonChar.END]: 'SouthWest',
    [Input.NonChar.NUMPAD_5]: 'Wait',
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
    if (entity.has(Components.WeaponInventory)) {
        var weaponEntity = entity.get(Components.WeaponInventory).currentWeapon;
        if (weaponEntity !== null) {
            var weapon = weaponEntity.get(Components.Weapon).weapon;
            return await weapon.use(entity);
        }
    }
    return null;
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

function maybeGet(entity) {
    let action = null;
    entity.cell.withEntity(Components.Getable, (item) => {
        action = new Turn(new Actions.Get(entity, item), 1);
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
                text = topEntity.get(Components.Name).value;
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
    hud.overlay =  renderText([
            'CONTROLS',
            '',
        ].concat(HelpText).concat([
            '',
            'Press any key to resume'
        ])
    );

    hud.showOverlay();
    await Input.getNonModifierKey();
    hud.hideOverlay();

    return null;
}

export const ControlTable = makeTable(ControlTypes, {
    West:       entity => new Actions.Walk(entity, Direction.West),
    South:      entity => new Actions.Walk(entity, Direction.South),
    North:      entity => new Actions.Walk(entity, Direction.North),
    East:       entity => new Actions.Walk(entity, Direction.East),
    NorthWest:  entity => new Actions.Walk(entity, Direction.NorthWest),
    NorthEast:  entity => new Actions.Walk(entity, Direction.NorthEast),
    SouthWest:  entity => new Actions.Walk(entity, Direction.SouthWest),
    SouthEast:  entity => new Actions.Walk(entity, Direction.SouthEast),
    CloseDoor:  toggleDoor,
    Fire:       useWeapon,
    Get:        maybeGet,
    Wait:       entity => new Actions.Wait(entity),
    Up:         maybeUp,
    Down:       maybeDown,
    Examine:    examine,
    NextWeapon: entity => new Actions.NextWeapon(entity),
    PreviousWeapon: entity => new Actions.PreviousWeapon(entity),
    Pistol:     entity => new Actions.SpecificWeapon(entity, 1),
    Shotgun:    entity => new Actions.SpecificWeapon(entity, 2),
    MachineGun: entity => new Actions.SpecificWeapon(entity, 3),
    Flamethrower: entity => new Actions.SpecificWeapon(entity, 4),
    Help:       help
});

export function getControlTypeFromKey(key) {
    let type = undefined;
    if (Input.keyIsChar(key)) {
        type = ControlChars[Input.getCharFromKey(key)];
    } else if (Input.keyIsNonChar(key)) {
        type = ControlNonChars[Input.getNonCharFromKey(key)];
    }
    if (type === undefined) {
        return null;
    }
    return type;
}

export function getControlFromKey(key) {
    let type = getControlTypeFromKey(key);
    let control = ControlTable[type];
    if (control === undefined) {
        return null;
    }
    return control;
}

export async function getControl() {
    var key = await Input.getNonModifierKey();
    return getControlFromKey(key);
}
