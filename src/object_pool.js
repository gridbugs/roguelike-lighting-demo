export class ObjectPool {
    constructor(Type, ...args) {
        this.Type = Type;
        this.array = new Array();
        this.index = 0;
        this.numObjects = 0;

        this.args = args;
    }

    allocate() {
        if (this.index == this.numObjects) {
            this.array[this.numObjects] = new this.Type(...this.args);
            ++this.numObjects;
        }
        let obj = this.array[this.index];
        ++this.index;
        return obj;
    }

    flush() {
        this.index = 0;
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.index; ++i) {
            yield this.array[i];
        }
    }
}
