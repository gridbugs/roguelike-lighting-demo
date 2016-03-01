import {Component} from 'engine/component.js';
import {Components} from 'components.js';

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

        if (open) {
            this.entity.remove(Components.Solid);
        } else {
            this.entity.add(new Components.Solid());
        }
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


