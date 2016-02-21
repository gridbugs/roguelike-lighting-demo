import {DoublyLinkedList, Node} from './doubly_linked_list.js';
import {ObjectPool} from './object_pool.js';
import {assert} from './assert.js';

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

    push(value) {
        this.linkedList.push(value);
    }

    shift() {
        return this.linkedList.shift();
    }

    clear() {
        this.linkedList.clear();
        this.nodePool.flush();
    }

    populate(iterable) {
        for (let x of iterable) {
            this.push(x);
        }
    }

    *[Symbol.iterator]() {
        yield* this.linkedList;
    }
}
