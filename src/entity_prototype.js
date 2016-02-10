export class EntityPrototype {
    constructor(array = []) {
        this.array = array;
    }

    add(array) {
        return new EntityPrototype(this.array.concat(array));
    }

    *[Symbol.iterator]() {
        yield* this.array;
    }
}
