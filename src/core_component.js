import {Component} from './component.js';

export class Tile extends Component {
    constructor(tile, depth) {
        super();
        this.tile = tile;
        this.depth = depth;
    }
}

export class WallTile extends Component {
    constructor(frontTile, topTile, depth) {
        super();
        this.frontTile = frontTile;
        this.topTile = topTile;
        this.depth = depth;
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
}

export class TurnTaker extends Component {
    constructor(takeTurn) {
        super();
        this.takeTurn = takeTurn;
        this.nextTurn = null;
    }

    get scheduled() {
        return this.nextTurn !== null;
    }
}

export class Observer extends Component {
    constructor(observe) {
        super();
        this.observe = observe;
    }
}
