import {getRandomInt} from 'utils/random.js';

/* Data structure for keeping track of the best values
 * that have been inserted into it, based on some given
 * compare function.
 */

export class BestSet {
    constructor(compare, initialSize = 0) {
        this.compare = compare;
        this.array = new Array(initialSize);
        this.length = 0;
        this.bestExample = 0;
    }

    clear() {
        this.length = 0;
    }

    get empty() {
        return this.length === 0;
    }

    insertToArray(x) {
        this.array[this.length] = x;
        ++this.length;
    }

    insertFirst(x) {
        this.insertToArray(x);
        this.bestExample = x;
    }

    insert(x) {
        if (this.empty) {
            this.insertFirst(x);
            return;
        }

        let cmp = this.compare(x, this.bestExample);
        if (cmp > 0) {
            /* The new value is better than anything seen before */
            this.clear();
            this.insertFirst(x);
        } else if (cmp === 0) {
            /* The new value is as good as the current best */
            this.insertToArray(x);
        }
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; ++i) {
            yield this.array[i];
        }
    }

    getRandom() {
        let index = getRandomInt(0, this.length);
        return this.array[index];
    }
}
