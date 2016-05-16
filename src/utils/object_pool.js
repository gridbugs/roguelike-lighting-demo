export class ObjectPool {
    constructor(Type, n = 0, ...args) {
        this.Type = Type;
        this.array = new Array(n);
        this.index = 0;
        this.numObjects = 0;

        /* Args are passed to the constructor rather than the allocate method,
         * as the object's constructor is only invoked if new objects are
         * needed, so they won't be used each time allocate is called.
         *
         * The args are given to object constructors only when new objects
         * are needed.
         */
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
