export class BestTracker {
    constructor(compare) {
        this.compare = compare;
        this._best = null;
        this.length = 0;
    }

    clear() {
        this._best = null;
        this.length = 0;
    }

    get empty() {
        return this.length === 0;
    }

    insert(x) {
        if (this.length === 0 || this.compare(x, this._best) > 0) {
            this._best = x;
        }
        ++this.length;
    }

    get best() {
        if (this.length !== 0) {
            return this._best;
        }
        throw new Error();
    }
}
