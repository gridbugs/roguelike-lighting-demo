import {DoublyLinkedList, Node} from 'utils/doubly_linked_list.js';
import {ObjectPool} from 'utils/object_pool.js';
import {assert} from 'utils/assert.js';

export class SearchQueue {
    constructor() {
        this.nodePool = new ObjectPool(Node);
        let allocateNode = () => {
            return this.nodePool.allocate();
        };
        this.linkedList = new DoublyLinkedList(allocateNode);
    }

    get length() {
        return this.linkedList.length;
    }

    get empty() {
        return this.linkedList.empty;
    }

    insert(value) {
        this.linkedList.push(value);
    }

    remove() {
        return this.linkedList.shift();
    }

    clear() {
        this.linkedList.clear();
        this.nodePool.flush();
    }

    populate(iterable) {
        for (let x of iterable) {
            this.insert(x);
        }
    }

    *[Symbol.iterator]() {
        yield* this.linkedList;
    }
}
