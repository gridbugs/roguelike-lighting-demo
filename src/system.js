export class System {
    constructor(ecsContext) {
        this.ecsContext = ecsContext;
        this.spacialHash = this.ecsContext.spacialHash;
    }

    getCell(x, y) {
        return this.spacialHash.get(x, y);
    }
}
