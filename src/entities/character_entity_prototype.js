import {Config} from 'config';

import {Components} from 'components';
import {Tiles} from 'tiles';

import * as Shadowcast from 'shadowcast';
import * as Omniscient from 'omniscient';

import {PlayerTurnTaker} from 'player_control';
import {MoveTowardsPlayer} from 'move_towards_player';

export function PlayerCharacter(x, y) {
    let observe;
    if (Config.OMNISCIENT) {
        observe = Omniscient.detectVisibleArea;
    } else {
        observe = Shadowcast.detectVisibleArea;
    }

    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PlayerCharacter, 4),
        new Components.TurnTaker(new PlayerTurnTaker()),
        new Components.Collider(),
        new Components.PlayerCharacter(),
        new Components.Observer(observe, 40),
        new Components.Unfamiliar(),
        new Components.Light(10, 3)
    ];
}
