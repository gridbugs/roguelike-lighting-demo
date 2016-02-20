import {Turn} from './turn.js';
import {Action} from './action.js';

import {Actions} from './actions.js';
import {Direction} from './direction.js';

import * as Input from './input.js';
import {controlFromChar} from './control.js';

async function getControlFunction() {
    var key = await Input.getNonModifierKey();
    if (Input.isCharKey(key)) {
        var character = Input.getCharFromKey(key);
        return controlFromChar(character);
    }
    return null;
}

async function getControlAction(entity) {
    while (true) {
        var fn = await getControlFunction();

        if (fn === null) {
            continue;
        }

        var action = await fn(entity);
        if (action === null) {
            continue;
        }

        return action;
    }
}

export async function playerTakeTurn(entity) {
    var action = await getControlAction(entity);
    if (action instanceof Action) {
        return new Turn(action);
    } else if (action instanceof Turn) {
        return action;
    } else {
        throw Error('invalid action');
    }
}
