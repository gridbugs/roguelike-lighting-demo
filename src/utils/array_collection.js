/* Array wrapper exposing collection interface */
export class ArrayCollection {
    constructor(initialSize = 0) {
        this.array = new Array(initialSize);
        this.length = 0;
    }

    get empty() {
        return this.length == 0;
    }

    clear() {
        this.length = 0;
    }

    add(value) {
        this.array[this.length] = value;
        this.length++;
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this.array[i];
        }
    }
}
