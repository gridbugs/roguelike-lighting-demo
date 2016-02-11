import {Component} from './component.js';
import {Vec2} from './vec2.js';

export class Position extends Component {
    constructor() {
        super();
        this.vector = new Vec2(0, 0);
    }

    init(x, y) {
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
}

export class Tile extends Component {

}

export class Solid extends Component {

}

export class Opacity extends Component {

}
