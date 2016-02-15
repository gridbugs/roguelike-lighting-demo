import {Turn} from './turn.js';
import {Action} from './action.js';

import {Actions} from './actions.js';
import {Direction} from './direction.js';

import {getChar} from './input.js';

const Controls = {
    d:  (entity) => { return new Actions.Walk(entity, Direction.West) },
    h:  (entity) => { return new Actions.Walk(entity, Direction.South) },
    t:  (entity) => { return new Actions.Walk(entity, Direction.North) },
    n:  (entity) => { return new Actions.Walk(entity, Direction.East) },

    f:  (entity) => { return new Actions.Walk(entity, Direction.NorthWest) },
    g:  (entity) => { return new Actions.Walk(entity, Direction.NorthEast) },
    x:  (entity) => { return new Actions.Walk(entity, Direction.SouthWest) },
    b:  (entity) => { return new Actions.Walk(entity, Direction.SouthEast) },
};

export async function playerTakeTurn(entity) {
    while (true) {
        var character = await getChar();
        var f = Controls[character];

        if (f === undefined) {
            continue;
        }

        var action = f(entity);
        if (action instanceof Action) {
            return new Turn(action);
        } else if (action instanceof Turn) {
            return action;
        } else {
            throw Error('invalid action');
        }
    }
}
