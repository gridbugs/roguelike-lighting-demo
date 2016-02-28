import {Config} from './config.js';

import {Components} from './components.js';
import {Tiles} from './tiles.js';

import * as Shadowcast from './shadowcast.js';
import * as Omniscient from './omniscient.js';

import * as Abilities from './abilities.js';

import {PlayerTurnTaker} from './player_control.js';
import {MoveTowardsPlayer} from './move_towards_player.js';

import {makeEnum} from './enum.js';

export const CombatGroups = makeEnum([
    'Friendly',
    'Hostile'
]);

export function PlayerCharacter(x, y) {
    let observe;
    if (Config.OMNISCIENT) {
        observe = Omniscient.detectVisibleArea;
    } else {
        observe = Shadowcast.detectVisibleArea;
    }

    let computeUpgrade = (depth) => {
        return depth * 10;
    }

    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PlayerCharacter, 3),
        new Components.TurnTaker(new PlayerTurnTaker()),
        new Components.Collider(),
        new Components.PlayerCharacter(),
        new Components.Observer(observe, 15),
        new Components.Health(10),
        new Components.Combatant(CombatGroups.Friendly),
        new Components.Attack(2),
        new Components.Defense(2),
        new Components.Accuracy(80),
        new Components.Dodge(20),
        new Components.Unfamiliar(),
        new Components.CurrentAbility(Abilities.FireBall),
        new Components.UpgradesOnDescent(computeUpgrade, 1)
    ];
}

function GenericCharacter(x, y, tile, health, burnTime = 5, healthRecovery = 0.1) {
    return [
        new Components.Position(x, y),
        new Components.Tile(tile, 3),
        new Components.TurnTaker(new MoveTowardsPlayer()),
        new Components.Collider(),
        new Components.Observer(Shadowcast.detectVisibleArea, 20, true),
        new Components.Health(health),
        new Components.MaxHealth(health),
        new Components.Combatant(CombatGroups.Hostile),
        new Components.Unfamiliar(),
        new Components.Flamable(burnTime),
        new Components.HealthRecovery(healthRecovery)
    ];
}

export function SpiderChild(x, y) {
    return GenericCharacter(x, y, Tiles.SpiderChild, 5).concat([
        new Components.Attack(1),
        new Components.Defense(1),
        new Components.Accuracy(100),
        new Components.Dodge(20),
    ]);
}

export function PyroGod(x, y) {
    return [
        new Components.Position(x, y),
        new Components.Tile(Tiles.PyroGod, 3),
        new Components.TurnTaker(new MoveTowardsPlayer()),
        new Components.Collider(),
        new Components.Observer(Omniscient.detectVisibleArea, 20, true),
        new Components.Health(5),
        new Components.MaxHealth(5),
        new Components.Combatant(CombatGroups.Hostile),
        new Components.Attack(4),
        new Components.Defense(1),
        new Components.Accuracy(100),
        new Components.Dodge(10),
        new Components.Unfamiliar()
    ];
}
