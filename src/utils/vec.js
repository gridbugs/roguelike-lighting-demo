export class Vec {
    normalizeInPlace(result) {
        this.divideInPlace(this.length, result);
    }

    normalize() {
        return this.divide(this.length);
    }

    get length() {
        return Math.sqrt(this.dot(this));
    }

    getDistance(v) {
        return Math.sqrt(this.getDistanceSquared(v));
    }
}
