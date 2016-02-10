export class Typed {
    get type() {
        return this.constructor.type;
    }
    get name() {
        return this.constructor.name;
    }
}
