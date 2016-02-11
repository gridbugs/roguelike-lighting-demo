import {Component} from './component.js';
import {Vec2} from './vec2.js';

export class Position extends Component {
    constructor(x, y) {
        super();

        this.vector = new Vec2(0, 0);

        if (typeof x === 'number') {
            this.vector.set(x, y);
        } else {
            x.copyTo(this.vector);
        }

        return this;
    }

    copyTo(dest) {
        super.copyTo(dest);
        this.vector.copyTo(dest.vector);
    }

    clone() {
        return new Position(this.vector);
    }

    get x() {
        return this.vector.x;
    }

    get y() {
        return this.vector.y;
    }

    set x(value) {
        this.vector.x = value;
    }

    set y(value) {
        this.vector.y = value;
    }
}

export class Tile extends Component {
    constructor(character) {
        super();
        this.character = character;
    }
}

export class Solid extends Component {
}

export class Opacity extends Component {
    constructor(value) {
        super();
        this.value = value;
    }
}
