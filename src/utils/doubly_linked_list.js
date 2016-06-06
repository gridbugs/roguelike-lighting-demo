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
        this.headNode = null;
        this.tailNode = null;
        this.length = 0;
    }

    get head() {
        return this.headNode.value;
    }

    get tail() {
        return this.tailNode.value;
    }

    get empty() {
        return this.headNode == null;
    }

    clear() {
        this.headNode = null;
        this.tailNode = null;
        this.length = 0;
    }

    deleteNode(node) {
        let prev = node.prev;
        let next = node.next;

        if (prev == null) {
            /* node was at the start of the list */
            assert(this.headNode == node);
            this.headNode = next;
        } else {
            prev.next = next;
        }

        if (next == null) {
            /* node was at the end of the list */
            assert(this.tailNode == node);
            this.tailNode = prev;
        } else {
            next.prev = prev;
        }

        this.length--;
    }

    /* Append value at tail */
    push(value) {
        let node = this.allocateNode();
        node.value = value;
        node.prev = this.tailNode;
        node.next = null;

        if (this.tailNode == null) {
            assert(this.length == 0);
            assert(this.headNode == null);
            this.headNode = node;
        } else {
            this.tailNode.next = node;
        }

        this.tailNode = node;

        this.length++;

        return node;
    }

    /* Remove and return tail */
    pop() {
        return this.popNode().value;
    }

    popNode() {
        let node = this.tailNode;

        this.tailNode = node.prev;

        if (this.tailNode == null) {
            assert(this.headNode == node);
            assert(this.length == 1);
            this.headNode = null;
        } else {
            assert(this.tailNode.next == node);
            this.tailNode.next = null;
        }

        --this.length;

        return node;
    }

    /* Prepend value at head */
    unshiftNode(value) {
        let node = this.allocateNode();
        node.value = value;
        node.next = this.headNode;
        node.prev = null;

        if (this.headNode == null) {
            assert(this.length == 0);
            assert(this.tailNode == null);
            this.tailNode = node;
        } else {
            this.headNode.prev = node;
        }

        this.headNode = node;

        this.length++;

        return node;
    }

    /* Remove and return head */
    shift() {
        return this.shiftNode().value;
    }

    shiftNode() {
        let node = this.headNode;

        this.headNode = node.next;

        if (this.headNode == null) {
            assert(this.tailNode == node);
            assert(this.length == 1);
            this.tailNode = null;
        } else {
            assert(this.headNode.prev == node);
            this.headNode.prev = null;
        }

        --this.length;

        return node;
    }

    *forwards() {
        for (let node = this.headNode; node != null; node = node.next) {
            yield node.value;
        }
    }

    *backwards() {
        for (let node = this.tailNode; node != null; node = node.prev) {
            yield node.value;
        }
    }

    *[Symbol.iterator]() {
        yield* this.forwards();
    }
}
