import {swapElements} from './array_utils.js';

/* A binary heap
 *
 * Elements are removed in priority order, with the
 * highest priority element being removed first.
 *
 * "compare" is a function of the form compare(a, b) that returns:
 * - a positive value iff a's priority is higher than b's
 * - a negative value iff a's priority is lower than b's
 * - 0 iff a's priority is equalt ot b's
 */
export class Heap {
    constructor(compare) {
        this.compare = compare;
        this.array = new Array();
        this.nextIndex = 1;
    }

    get empty() {
        return this.nextIndex === 1;
    }

    get length() {
        return this.nextIndex - 1;
    }

    clear() {
        this.nextIndex = 1;
    }

    *[Symbol.iterator]() {
        for (let i = 1; i < this.nextIndex; ++i) {
            yield this.array[i];
        }
    }

    insert(x) {
        var index = this.nextIndex;
        ++this.nextIndex;

        this.array[index] = x;

        while (index != 1) {
            let parentIndex = index >> 1;
            if (this.compare(this.array[parentIndex], this.array[index]) > 0) {
                break;
            } else {
                swapElements(this.array, index, parentIndex);
                index = parentIndex;
            }
        }
    }

    peek() {
        if (this.empty) {
            throw new Error("Heap is empty");
        }
        return this.array[1];
    }

    pop() {
        if (this.empty) {
            throw new Error("Heap is empty");
        }
        var ret = this.array[1];

        --this.nextIndex;
        this.array[1] = this.array[this.nextIndex];
        this.array[this.nextIndex] = null;

        var index = 1;
        var maxIndex = this.nextIndex - 1;
        while (true) {
            let leftChildIndex = index << 1;
            let rightChildIndex = leftChildIndex + 1
            let nextIndex;

            if (leftChildIndex < maxIndex) {
                if (this.compare(this.array[leftChildIndex], this.array[rightChildIndex]) > 0) {
                    nextIndex = leftChildIndex;
                } else {
                    nextIndex = rightChildIndex;
                }

                if (this.compare(this.array[nextIndex], this.array[index]) > 0) {
                    swapElements(this.array, index, nextIndex);
                    index = nextIndex;
                    continue;
                }
            } else if (leftChildIndex === maxIndex && this.compare(this.array[leftChildIndex], this.array[index]) > 0) {
                swapElements(this.array, index, leftChildIndex);
            }

            break;
        }

        return ret;
    }
}
