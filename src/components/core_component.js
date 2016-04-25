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

export class MoveThroughCombatant extends Component {}

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

export class Health extends ValueComponent {}

export class MaxHealth extends ValueComponent {}

export class Unfamiliar extends Component {}

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

export class Water extends Component {}

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
