import {Actions} from 'actions';
import {Direction} from 'utils/direction';
import {Components} from 'components';
import {EntityPrototypes} from 'entity_prototypes';
import {makeEnum, substituteValues, makeTable} from 'utils/enum';
import * as Input from 'utils/input';
import {Turn} from 'engine/turn';
import {renderText, HelpText} from 'text';
import {degreesToRadians as d2r} from 'utils/angle';

export const ControlTypes = makeEnum([
    'West',
    'South',
    'North',
    'East',
    'NorthWest',
    'NorthEast',
    'SouthWest',
    'SouthEast',
    'Wait',
    'Close',
    'TurnLeft',
    'TurnRight',
    'Shoot'
], true);

const ControlChars = substituteValues(ControlTypes, {
    'h': 'West',
    'j': 'South',
    'k': 'North',
    'l': 'East',
    'y': 'NorthWest',
    'u': 'NorthEast',
    'b': 'SouthWest',
    'n': 'SouthEast',
    '.': 'Wait',
    'c': 'Close',
    'q': 'TurnLeft',
    'e': 'TurnRight',
    'f': 'Shoot'
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
        if (door != null && door.get(Components.Door).open) {
            return new Actions.CloseDoor(entity, door);
        }
    }
    for (let neighbour of entity.cell.neighbours) {
        let door = neighbour.find(Components.Door);
        if (door != null && !door.get(Components.Door).open) {
            return new Actions.OpenDoor(entity, door);
        }
    }
    return null;
}

const TURN_ANGLE = d2r(45);

export const ControlTable = makeTable(ControlTypes, {
    West:       entity => new Actions.Walk(entity, Direction.West),
    South:      entity => new Actions.Walk(entity, Direction.South),
    North:      entity => new Actions.Walk(entity, Direction.North),
    East:       entity => new Actions.Walk(entity, Direction.East),
    NorthWest:  entity => new Actions.Walk(entity, Direction.NorthWest),
    NorthEast:  entity => new Actions.Walk(entity, Direction.NorthEast),
    SouthWest:  entity => new Actions.Walk(entity, Direction.SouthWest),
    SouthEast:  entity => new Actions.Walk(entity, Direction.SouthEast),
    Wait:       entity => new Actions.Wait(entity),
    Close:      toggleDoor,
    TurnLeft:   entity => new Actions.DirectionalLightTurn(entity, TURN_ANGLE),
    TurnRight:  entity => new Actions.DirectionalLightTurn(entity, -TURN_ANGLE),
    Shoot:      entity => new Actions.Shoot(entity)
});

export function getControlTypeFromKey(key) {
    let type = undefined;
    if (Input.keyIsChar(key)) {
        type = ControlChars[Input.getCharFromKey(key)];
    } else if (Input.keyIsNonChar(key)) {
        type = ControlNonChars[Input.getNonCharFromKey(key)];
    }
    if (type == undefined) {
        return null;
    }
    return type;
}

export function getControlFromKey(key) {
    let type = getControlTypeFromKey(key);
    let control = ControlTable[type];
    if (control == undefined) {
        return null;
    }
    return control;
}

export async function getControl() {
    var key = await Input.getNonModifierKey();
    return getControlFromKey(key);
}
