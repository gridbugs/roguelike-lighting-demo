import {Components} from './components.js';
import {Tiles} from './tiles.js';

import * as Shadowcast from './shadowcast.js';
import * as Omniscient from './omniscient.js';

import {PlayerTurnTaker} from './player_control.js';
import {MoveTowardsPlayer} from './move_towards_player.js';

import {makeEnum} from './enum.js';

export const CombatGroups = makeEnum([
    'Friendly',
    'Hostile'
]);

export function PlayerCharacter(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PlayerCharacter, 2),
        new Components.TurnTaker(new PlayerTurnTaker()),
        new Components.Collider(),
        new Components.PlayerCharacter(),
        new Components.Observer(Omniscient.detectVisibleArea, 20),
        new Components.Health(1),
        new Components.Combatant(CombatGroups.Friendly),
        new Components.Attack(2),
        new Components.Defense(2),
        new Components.Accuracy(80),
        new Components.Dodge(20),
        new Components.Unfamiliar()
    ];
}

export function SpiderChild(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.SpiderChild, 2),
        new Components.TurnTaker(new MoveTowardsPlayer()),
        new Components.Collider(),
        new Components.Observer(Shadowcast.detectVisibleArea, 20, true),
        new Components.Health(5),
        new Components.Combatant(CombatGroups.Hostile),
        new Components.Attack(4),
        new Components.Defense(1),
        new Components.Accuracy(100),
        new Components.Dodge(10),
        new Components.Unfamiliar(),
        new Components.Flamable(5)
    ];
}
