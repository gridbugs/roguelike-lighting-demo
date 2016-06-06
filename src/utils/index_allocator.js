import {DoublyLinkedList} from 'utils/doubly_linked_list';

export  class IndexAllocator {
    constructor() {
        this.list = new DoublyLinkedList();
        this.count = 0;
    }

    allocate() {
        if (this.list.empty) {
            let index = this.count;
            this.count++;
            return index;
        }
        return this.list.shift();
    }

    free(index) {
        this.list.push(index);
    }
}
