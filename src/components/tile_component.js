import {Component} from 'engine/component.js';
import {Components} from 'components.js';
import {getRandomInt, getRandomIntInclusive} from 'utils/random.js';

export function getTileComponent(entity) {
    let component;
    component = entity.get(Components.Tile);
    if (component !== null) {
        return component;
    }
    component = entity.get(Components.WallTile);
    if (component !== null) {
        return component;
    }
    component = entity.get(Components.RandomlyAnimatedTile);
    if (component !== null) {
        return component;
    }
    return null;
}

export function getTileComponentDepth(entity) {
    let component = getTileComponent(entity);
    if (component !== null) {
        return component.depth;
    }
    return null;
}

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

export class RandomlyAnimatedTile extends Component {
    constructor(tiles, depth, timeMin = 1, timeMax = 10) {
        super();
        if (tiles !== null) {
            this._tile = null;
            this._depth = depth;
            this.tiles = tiles;
            this.timeMin = timeMin;
            this.timeMax = timeMax;
            this.change();
        }
        this.reference = null;
    }

    get depth() {
        if (this.reference === null) {
            return this._depth;
        } else {
            return this.reference.depth;
        }
    }

    get tile() {
        if (this.reference === null) {
            return this._tile;
        } else {
            return this.reference.tile;
        }
    }

    change() {
        this.index = getRandomInt(0, this.tiles.length);
        this.time = getRandomIntInclusive(this.timeMin, this.timeMax);
        this._tile = this.tiles[this.index];
    }

    maybeChange(timeDelta) {
        if (this.reference === null) {
            if (timeDelta > this.time) {
                this.change();
            } else {
                this.time -= timeDelta;
            }
        } else {
            this.reference.maybeChange(timeDelta);
        }
    }

    createReference() {
        let tile = new RandomlyAnimatedTile(null, null, null, null);
        if (this.reference === null) {
            tile.reference = this;
        } else {
            tile.reference = this.reference;
        }

        return tile;
    }

    clone() {
        return this.createReference();
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.reference = this;
    }
}
