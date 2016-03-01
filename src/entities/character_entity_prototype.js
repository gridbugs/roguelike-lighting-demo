import {Config} from 'config.js';

import {Components} from 'components.js';
import {Tiles} from 'tiles.js';

import * as Shadowcast from 'shadowcast.js';
import * as Omniscient from 'omniscient.js';

import * as Abilities from 'abilities.js';

import {PlayerTurnTaker} from 'player_control.js';
import {MoveTowardsPlayer} from 'move_towards_player.js';

import {makeEnum} from 'utils/enum.js';

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
        new Components.Defense(1),
        new Components.Accuracy(80),
        new Components.Dodge(10),
        new Components.Unfamiliar(),
        new Components.CurrentAbility(Abilities.FireBall),
        new Components.UpgradesOnDescent(computeUpgrade, 1),
        new Components.Name("You"),
        new Components.Description("You. A faithful servant of the Pyro God. You returned to the former home of your ancestors in search of his ancient cathedral, only to find the city in ruins.")
    ];
}

function GenericCharacter(x, y, tile, health, walkTime, burnTime = 5, healthRecovery = 0.1) {
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
        new Components.HealthRecovery(healthRecovery),
        new Components.WalkTime(walkTime)
    ];
}

export function SpiderChild(x, y) {
    return GenericCharacter(x, y, Tiles.SpiderChild, 5, 0.5).concat([
        new Components.Attack(1),
        new Components.Defense(1),
        new Components.Accuracy(80),
        new Components.Dodge(20),
        new Components.Name("Spider Child"),
        new Components.Description("A small human child, except it has eight legs, and twelve eyes. Small and fast, but not too tough.")
    ]);
}

export function PyroGod(x, y) {
    return GenericCharacter(x, y, Tiles.PyroGod, 30, 2, 2).concat([
        new Components.Attack(4),
        new Components.Defense(1),
        new Components.Accuracy(100),
        new Components.Dodge(10),
        new Components.WinOnDeath(),
        new Components.Name("Pyro God"),
        new Components.Description("Finally you've found the one you seek. He looks...different from the statues. What's wrong with him?")
    ]);
}

export function Mouths(x, y) {
    return GenericCharacter(x, y, Tiles.Mouths, 2, 3).concat([
        new Components.Attack(4),
        new Components.Defense(1),
        new Components.Accuracy(100),
        new Components.Dodge(10),
        new Components.Name("Mouthpile"),
        new Components.Description("This creature is mostly mouths. It looks like it could do some real damage if it got close enough.")
    ]);
}

export function Guardian(x, y) {
    return GenericCharacter(x, y, Tiles.Guardian, 20, 1).concat([
        new Components.Attack(3),
        new Components.Defense(2),
        new Components.Accuracy(80),
        new Components.Dodge(10),
        new Components.Name("Cathedral Guardian"),
        new Components.Description("The most human-looking being you've encountered so far, despite its enormous size and glowing, red eyes.")
    ]);
}

export function Sprite(x, y) {
    return GenericCharacter(x, y, Tiles.Sprite, 2, 1).concat([
        new Components.Attack(2),
        new Components.Defense(1),
        new Components.Accuracy(80),
        new Components.Dodge(10),
        new Components.Burning(1, true),
        new Components.Fireproof(),
        new Components.Name("Sprite"),
        new Components.Description("A creature made of fire. Or perhaps it's just on fire.")
    ]);
}
