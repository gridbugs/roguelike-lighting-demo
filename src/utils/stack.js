export class Stack {
    constructor(n = 0) {
        this.array = new Array(n);
        this.index = 0;
    }

    push(x) {
        this.array[this.index] = x;
        ++this.index;
    }

    pop() {
        --this.index;
        return this.array[this.index];
    }

    clear() {
        this.index = 0;
    }

    get empty() {
        return this.index === 0;
    }

    get length() {
        return this.index;
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.index; ++i) {
            yield this.array[i];
        }
    }
}
