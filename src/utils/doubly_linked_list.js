import {assert} from 'utils/assert';

export class Node {
    constructor() {
        this.value = null;
        this.next = null;
        this.prev = null;
    }
}

function defaultAllocateNode() {
    return new Node();
}

export class DoublyLinkedList {
    constructor(allocateNode = defaultAllocateNode) {
        this.allocateNode = allocateNode;
        this.clear();
    }

    get head() {
        return this._head.value;
    }

    get tail() {
        return this._tail.value;
    }

    get empty() {
        return this._head == null;
    }

    clear() {
        this._head = null;
        this._tail = null;
        this.length = 0;
    }

    /* Append value at tail */
    push(value) {
        let node = this.allocateNode();
        node.value = value;
        node.prev = this._tail;
        node.next = null;

        if (this._tail == null) {
            assert(this.length == 0);
            assert(this._head == null);
            this._head = node;
        } else {
            this._tail.next = node;
        }

        this._tail = node;

        ++this.length;
    }

    /* Remove and return tail */
    pop() {
        let node = this._tail;

        this._tail = node.prev;

        if (this._tail == null) {
            assert(this._head == node);
            assert(this.length == 1);
            this._head = null;
        } else {
            assert(this._tail.next == node);
            this._tail.next = null;
        }

        --this.length;

        return node.value;
    }

    /* Prepend value at head */
    unshift(value) {
        let node = this.allocateNode();
        node.value = value;
        node.next = this._head;
        node.prev = null;

        if (this._head == null) {
            assert(this.length == 0);
            assert(this._tail == null);
            this._tail = node;
        } else {
            this._head.prev = node;
        }

        this._head = node;

        ++this.length;
    }

    /* Remove and return head */
    shift() {
        let node = this._head;

        this._head = node.next;

        if (this._head == null) {
            assert(this._tail == node);
            assert(this.length == 1);
            this._tail = null;
        } else {
            assert(this._head.prev == node);
            this._head.prev = null;
        }

        --this.length;

        return node.value;
    }

    *forwards() {
        for (let node = this._head; node != null; node = node.next) {
            yield node.value;
        }
    }

    *backwards() {
        for (let node = this._tail; node != null; node = node.prev) {
            yield node.value;
        }
    }

    *[Symbol.iterator]() {
        yield* this.forwards();
    }
}
