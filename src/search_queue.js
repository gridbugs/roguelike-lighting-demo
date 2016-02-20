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
}
