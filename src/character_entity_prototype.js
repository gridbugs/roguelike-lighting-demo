import {Components} from './components.js';
import {Tiles} from './tiles.js';

import * as Shadowcast from './shadowcast.js';
import * as Omniscient from './omniscient.js';

import {PlayerTurnTaker} from './player_control.js';
import {MoveTowardsPlayer} from './move_towards_player.js';


export function PlayerCharacter(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PlayerCharacter, 2),
        new Components.TurnTaker(new PlayerTurnTaker()),
        new Components.Collider(),
        new Components.PlayerCharacter(),
        new Components.Observer(Shadowcast.detectVisibleArea, 20)
        //new Components.Observer(Omniscient.detectVisibleArea, 20)
    ];
}

export function SpiderChild(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.SpiderChild, 2),
        new Components.TurnTaker(new MoveTowardsPlayer()),
        new Components.Collider(),
        new Components.Observer(Shadowcast.detectVisibleArea, 20, true)
    ];
}
