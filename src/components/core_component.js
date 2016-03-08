import {Component} from 'engine/component';
import {Knowledge} from 'knowledge';

import {Components} from 'components';
import {Weapons} from 'weapons';

class ValueComponent extends Component {
    constructor(value) {
        super();
        this._value = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.updateCellTurn();
    }

    clone() {
        return new this.constructor(this.value);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.value = this.value;
    }

}

class SetComponent extends Component {
    onAdd(entity) {
        super.onAdd(entity);
        this.set.add(entity);
    }

    onRemove(entity) {
        this.set.delete(entity);
        super.onRemove(entity);
    }
}

export class Solid extends Component {}

export class Collider extends Component {}

export class Opacity extends Component {
    constructor(value) {
        super();
        this.value = value;
    }

    clone() {
        return new Opacity(this.value);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.value = this.value;
    }
}

export class Observer extends Component {
    constructor(observe, viewDistance, familiar = false) {
        super();
        this.observe = observe;
        this.viewDistance = viewDistance;
        this.knowledge = new Knowledge(familiar);
        this.familiar = familiar;
    }

    clone() {
        return new Observer(this.observe, this.viewDistance, this.familiar);
    }
}

export class Projectile extends Component {}

export class Health extends ValueComponent {}

export class MaxHealth extends ValueComponent {}

export class Combatant extends Component {
    constructor(group) {
        super();
        this.group = group;
    }

    clone() {
        return new Combatant(this.group);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.group = this.group;
    }
}

export class FireStarter extends Component {}

export class Flamable extends Component {
    constructor(time) {
        super();
        this.time = time;
    }

    clone() {
        return new Flamable(this.time);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.time = this.time;
    }
}

export class Burning extends SetComponent {
    constructor(time, infinite = false) {
        super();
        this.time = time;
        this.infinite = infinite;
    }

    get set() {
        return this.ecsContext.fire.entities;
    }

    clone() {
        return new Burning(this.time, this.infinite);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.time = this.time;
        dest.infinite = this.infinite;
    }
}

export class Fireproof extends Component {}

export class Unfamiliar extends Component {}

export class CurrentWeapon extends Component {
    constructor(weapon) {
        super();
        this.weapon = weapon;
    }

    clone() {
        return new CurrentWeapon(this.weapon);
    }

    copy(dest) {
        super.copyTo(dest);
        dest.weapon = this.weapon;
    }
}

export class WeaponInventory extends Component {
    constructor() {
        super();
        this.slots = new Array(Weapons.length);
        for (let i = 0; i < this.slots.length; ++i) {
            this.slots[i] = null;
        }
        this.index = -1;
    }

    get currentWeapon() {
        if (this.index === -1) {
            return null;
        }
        return this.slots[this.index];
    }

    addWeapon(weaponEntity) {
        let alreadyPresent = true;
        let weapon = weaponEntity.get(Components.Weapon).weapon;
        let current = this.slots[weapon.type];
        if (current === null) {
            this.slots[weapon.type] = weaponEntity;
            alreadyPresent = false;
        } else {
            current.get(Components.Weapon).weapon.addAmmoFromWeapon(weapon);
        }

        if (this.index === -1) {
            this.index = weapon.type;
        }

        return alreadyPresent;
    }

    switchForwards() {
        do {
            this.index = (this.index + 1) % this.slots.length;
        } while (this.slots[this.index] === null);
    }

    switchBackwards() {
        do {
            this.index = ((this.index - 1) + this.slots.length) % this.slots.length;
        } while (this.slots[this.index] === null);
    }

    switchSpecific(index) {
        if (index < this.slots.length && this.slots[index] !== null) {
            this.index = index;
        }
    }
}

export class DownStairs extends Component {
    constructor(level = null, upStairs = null) {
        super();
        this.level = level;
        this.upStairs = upStairs;
    }

    clone() {
        return new DownStairs(this.level, this.upStairs);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.level = this.level;
        dest.upStairs = this.upStairs;
    }
}

export class UpStairs extends Component {
    constructor(level = null, downStairs = null) {
        super();
        this.level = level;
        this.downStairs = downStairs;
    }

    clone() {
        return new DownStairs(this.level, this.downStairs);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.level = this.level;
        dest.downStairs = this.downStairs;
    }
}

export class Meltable extends Component {}

export class Water extends Component {}

export class HealthRecovery extends SetComponent {
    constructor(rate) {
        super();
        this.rate = rate;
    }

    get set() {
        return this.ecsContext.healing.entities;
    }

    clone() {
        return new HealthRecovery(this.rate);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.rate = this.rate;
    }
}

export class UpgradesOnDescent extends Component {
    constructor(calculate, maxDepth) {
        super();
        this.calculate = calculate;
        this.maxDepth = maxDepth;
    }

    clone() {
        return new UpgradesOnDescent(this.calculate, this.maxDepth);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.calculate = this.calculate;
        dest.maxDepth = this.maxDepth;
    }
}

export class WinOnDeath extends Component {}

export class WalkTime extends ValueComponent {}

export class Name extends Component {
    constructor(textOrFn, simpleName = textOrFn) {
        super();
        this.textOrFn = textOrFn;
        this.simpleName = simpleName;
    }

    clone() {
        return new Name(this.textOrFn, this.simpleName);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.textOrFn = this.textOrFn;
        dest.simpleName = this.simpleName;
    }

    get simpleValue() {
        if (typeof this.simpleName === 'function') {
            return this.simpleName(this.entity);
        } else {
            return this.simpleName;
        }
    }

    get value() {
        if (typeof this.textOrFn === 'function') {
            return this.textOrFn(this.entity);
        } else {
            return this.textOrFn;
        }
    }
}

export class Description extends ValueComponent {}

export class Weapon extends Component {
    constructor(weapon) {
        super();
        this.weapon = weapon;
    }

    clone() {
        return new Weapon(this.weapon);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.weapon = this.weapon;
    }
}

export class Bullet extends Component {}
export class ShockWave extends Component {}
export class Getable extends Component {}
export class Knockable extends Component {}
export class Breakable extends Component {}
export class Void extends Component {}

export class Ventable extends SetComponent {
    get set() {
        return this.ecsContext.atmosphere.ventableEntities;
    }
}

export class StuckInSpace extends Component {}

export class Oxygen extends ValueComponent {}
export class MaxOxygen extends ValueComponent {}

export class Breathing extends SetComponent {
    constructor(rate) {
        super();
        this.rate = rate;
    }

    get set() {
        return this.ecsContext.atmosphere.breathingEntities;
    }

    clone() {
        return new Breathing(this.rate);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.rate = this.rate;
    }
}

export class HealthKit extends ValueComponent {}

export class Skeleton extends Component {}
export class Bloat extends Component {}

export class TimedTransformation extends SetComponent {
    constructor(time, entityPrototype) {
        super();
        this.time = time;
        this.entityPrototype = entityPrototype;
    }

    get set() {
        return this.ecsContext.timedTransformations.transformingEntities;
    }

    clone() {
        return new TimedTransformation(this.time, this.entityPrototype);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.time = this.time;
        dest.entityPrototype = this.entityPrototype;
    }
}

export class AutoPickup extends Component {}
