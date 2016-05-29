export class Vec {
    normalizeInPlace(result) {
        this.divideInPlace(this.length, result);
    }

    normalize() {
        return this.divide(this.length);
    }

    get length() {
        return this.getLength();
    }

    getLengthSquared() {
        return this.dot(this);
    }

    getLength() {
        return Math.sqrt(this.getLengthSquared());
    }

    getDistance(v) {
        return Math.sqrt(this.getDistanceSquared(v));
    }
}
