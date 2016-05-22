import {assert} from 'utils/assert';

export const RangeTableEntry = NAMED_TUPLE(
    table = null,
    value = null,
    index = 0,
    startOffset = 0,
    endOffset = 0
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

    computeOffset(key, index) {
        return key - index * this.step - this.min;
    }

    getRange(startKey, endKey, resultPool) {
        let startIndex = this.keyToIndex(startKey);
        let endIndex = this.keyToIndex(endKey);

        let startOffset = this.computeOffset(startKey, startIndex);
        let endOffset = this.computeOffset(endKey, endIndex);

        if (startIndex == endIndex && endOffset >= startOffset) {
            /* Special case when there's only one entry */
            this._populateEntry(resultPool.allocate(), startIndex, startOffset, endOffset);
            return;
        }

        /* Range from start key to the end of the table slot */
        this._populateEntry(resultPool.allocate(), startIndex, startOffset, this.step);

        /* Intermediate slots */
        let midStartIndex = (startIndex + 1) % this.length;
        for (let i = midStartIndex; i != endIndex; i = (i + 1) % this.length) {
            this._populateEntry(resultPool.allocate(), i, 0, this.step);
        }

        /* Range from start of table slot to end key */
        this._populateEntry(resultPool.allocate(), endIndex, 0, endOffset);
    }

    _populateEntry(entry, index, startOffset, endOffset) {
        entry.table = this;
        entry.value = this.array[index];
        entry.index = index;
        entry.startOffset = startOffset;
        entry.endOffset = endOffset;
    }
}
