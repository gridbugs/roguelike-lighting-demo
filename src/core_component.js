import {Component} from './component.js';
import {Knowledge} from './knowledge.js';

import {Components} from './components.js';

class ValueComponent extends Component {
    constructor(value) {
        super();
        this.value = value;
    }

    clone() {
        return new this.constructor(this.value);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.value = this.value;
    }

}

class PassiveComponent extends Component {
    onAdd(entity) {
        super.onAdd(entity);
        this.system.add(entity);
    }

    onRemove(entity) {
        this.system.remove(entity);
        super.onRemove(entity);
    }
}

export class Solid extends Component {
}

export class Collider extends Component {
}

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

export class PlayerCharacter extends Component {
}

export class Projectile extends Component {
}

export class Health extends ValueComponent {
}

export class MaxHealth extends ValueComponent {
}

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

export class FireStarter extends Component {
}

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

export class Burning extends PassiveComponent {
    constructor(time, infinite = false) {
        super();
        this.time = time;
        this.infinite = infinite;
    }

    get system() {
        return this.ecsContext.fire;
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

export class Fireproof extends Component {
}

export class Unfamiliar extends Component {
}

export class CurrentAbility extends Component {
    constructor(ability) {
        super();
        this.ability = ability;
    }

    clone() {
        return new CurrentAbility(this.ability);
    }

    copy(dest) {
        super.copyTo(dest);
        dest.ability = this.ability;
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

export class Meltable extends Component {
}

export class Water extends Component {
}

export class HealthRecovery extends PassiveComponent {
    constructor(rate) {
        super();
        this.rate = rate;
    }

    get system() {
        return this.ecsContext.healing;
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
        dest.calculate = this.calculate;
        dest.maxDepth = this.maxDepth;
    }
}

export class WinOnDeath extends Component {
}

export class WalkTime extends ValueComponent {}

export class Name extends ValueComponent {}
export class Description extends ValueComponent {}
