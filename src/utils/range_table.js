import {assert} from 'utils/assert';

export const RangeTableEntry = NAMED_TUPLE(
    table = null,
    value = null,
    key = 0,
    index = 0,
    offset = 0
);

/* Data structure mapping ranges of numbers to entries in a table
 *
 * The array argument should refer to an array that is not changed
 * directly after the table is created.
 */
export class RangeTable {
    constructor(min, max, array) {
        this.min = min;
        this.max = max;
        this.array = array;
        this.range = max - min;
        this.step = this.range / this.length;
    }

    get length() {
        return this.array.length;
    }

    keyToIndex(key) {
        let index = Math.floor((key - this.min) / this.step);

        /* Case where value == this.max */
        if (index == this.length) {
            index--;
        }

        assert(index > 0 && index < this.length);

        return index;
    }

    indexToKey(index) {
        return index * this.step + this.min;
    }

    get(key, result) {
        if (value < this.min || value > this.max) {
            return null;
        }

        let index = this.keyToIndex(key);

        this._populateEntry(key, index, result);
    }

    getRange(startKey, endKey, resultPool) {
        let startIndex = this.keyToIndex(startKey);
        let endIndex = this.keyToIndex(endKey);

        let startResult = resultPool.allocate();
        this._populateEntry(startKey, startIndex, startResult);

        let rangeStart = (startIndex + 1) % this.length;
        for (let i = rangeStart; i != endIndex; i++) {
            let result = resultPool.allocate();
            let key = this.indexToKey(i);
            this._populateEntry(key, i, result);
        }

        let endResult = resultPool.allocate();
        this._populateEntry(endKey, endIndex, endResult);
    }

    _populateEntry(key, index, entry) {
        entry.table = this;
        entry.value = this.array[index];
        entry.key = key;
        entry.index = index;
        entry.offset = key - this.indexToKey(index);
    }
}
