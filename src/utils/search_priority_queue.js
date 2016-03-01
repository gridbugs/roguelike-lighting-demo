import {Heap} from './heap.js';

export class SearchPriorityQueue {
    constructor(compare) {
        this.heap = new Heap(compare);
    }

    get length() {
        return this.heap.length;
    }

    get empty() {
        return this.heap.empty;
    }

    clear() {
        this.heap.clear();
    }

    insert(value) {
        this.heap.insert(value);
    }

    remove() {
        return this.heap.pop();
    }

    populate(iterable) {
        for (let x of iterable) {
            this.insert(x);
        }
    }

    *[Symbol.iterator]() {
        yield* this.heap;
    }
}
