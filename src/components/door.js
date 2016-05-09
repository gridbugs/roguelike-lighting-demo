import {Component} from 'engine/component';
import {Components} from 'components';

export class Door extends Component {
    constructor(open, openTile, closedTile) {
        super();
        this.open = open;
        this.openTile = openTile;
        this.closedTile = closedTile;
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


