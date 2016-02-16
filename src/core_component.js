import {Component} from './component.js';
import {Knowledge} from './knowledge.js';

import {Components} from './components.js';

export class Tile extends Component {
    constructor(tile, depth) {
        super();
        this.tile = tile;
        this.depth = depth;
    }

    clone() {
        return new Tile(this.tile, this.depth);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.tile = this.tile;
        dest.depth = this.depth;
    }
}

export class WallTile extends Component {
    constructor(frontTile, topTile, depth) {
        super();
        this.frontTile = frontTile;
        this.topTile = topTile;
        this.depth = depth;
    }

    clone() {
        return new WallTile(this.frontTile, this.topTile, this.depth);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.frontTile = this.frontTile;
        dest.topTile = this.topTile;
        dest.depth = this.depth;
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

export class TurnTaker extends Component {
    constructor(takeTurn) {
        super();
        this.takeTurn = takeTurn;
        this.nextTurn = null;
    }

    get scheduled() {
        return this.nextTurn !== null;
    }

    clone() {
        return new TurnTaker(this.takeTurn);
    }
}

export class Observer extends Component {
    constructor(observe, viewDistance) {
        super();
        this.observe = observe;
        this.viewDistance = viewDistance;
        this.knowledge = new Knowledge();
    }

    clone() {
        return new Observer(this.observe, this.viewDistance);
    }
}

export class PlayerCharacter extends Component {
}

export class Door extends Component {
    constructor(open, openTile, closedTile) {
        super();
        this._open = open;
        this.openTile = openTile;
        this.closedTile = closedTile;
    }

    get open() {
        return this._open;
    }

    get closed() {
        return !this._open;
    }

    set open(open) {
        this._open = open;
        this.entity.with(Components.Tile, (tile) => {
            if (open) {
                tile.tile = this.openTile;
            } else {
                tile.tile = this.closedTile;
            }
        });
        this.entity.with(Components.Opacity, (opacity) => {
            if (open) {
                opacity.value = 0;
            } else {
                opacity.value = 1;
            }
        });
        this.entity.cell.recompute();
    }

    clone() {
        return new Door(this.open, this.openTile, this.closedTile);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest._open = this._open;
        dest.openTile = this.openTile;
        dest.closedTile = this.closedTile;
    }
}
