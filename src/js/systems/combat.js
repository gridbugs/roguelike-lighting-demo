import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

import {getRandomIntInclusive} from 'utils/random';

function rollD100() {
    return getRandomIntInclusive(1, 100);
}

function rollD6() {
    return getRandomIntInclusive(1, 6);
}

export class Combat extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.MeleeAttack, (action) => {
            action.success = false;
            let hitting = rollD100() < action.attacker.get(Components.Accuracy).value;
            if (hitting) {
                let dodging = rollD100() < action.target.get(Components.Dodge).value;
                if (!dodging) {
                    let attack = 0;
                    for (let i = 0; i < action.attacker.get(Components.Attack).value; ++i) {
                        attack += rollD6();
                    }
                    let defense = 0;
                    for (let i = 0; i < action.target.get(Components.Defense).value; ++i) {
                        defense += rollD6();
                    }
                    let damage = attack - defense;
                    if (damage > 0) {
                        this.ecsContext.scheduleImmediateAction(
                                new Actions.MeleeAttackHit(action.entity, action.target, damage));
                    }
                }
            }
        });
    }
}
