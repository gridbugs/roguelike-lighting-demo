export class System {
    constructor(ecsContext) {
        this.ecsContext = ecsContext;
    }

    get spacialHash() {
        return this.ecsContext.spacialHash;
    }

    getCell(x, y) {
        return this.spacialHash.get(x, y);
    }
}
