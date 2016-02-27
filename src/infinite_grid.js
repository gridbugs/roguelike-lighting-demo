import {SignedArray} from './signed_array_utils.js';

export class InfiniteGrid {
    constructor() {
        this.rows = new SignedArray();
    }

    _getRow(y) {
        let row = this.rows.get(y);
        if (row === undefined) {
            row = new SignedArray();
            this.rows.set(y, row);
        }
        return row;
    }

    get(x, y) {
        if (typeof x !== 'number') {
            x = x.x;
            y = x.y;
        }
        let row = this._getRow(y);
        return row.get(x);
    }

    set(x, y, value) {
        if (typeof x !== 'number') {
            x = x.x;
            y = x.y;
            value = y;
        }
        let row = this._getRow(y);
        row.set(x, value);
    }

    *iterate(x, y, width, height) {
        if (typeof x !== 'number') {
            x = x.x;
            y = x.y;
            width = y.x;
            height = y.y;
        }
        for (let i = y; i < height; ++i) {
            for (let j = x; j < width; ++j) {
                yield this.get(j, i);
            }
        }
    }
}
