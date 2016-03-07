export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        if (typeof x === 'number') {
            this.x = x;
            this.y = y;
        } else {
            this.x = x.x;
            this.y = x.y;
        }
    }

    copyTo(dest) {
        dest.x = this.x;
        dest.y = this.y;
    }

    arraySet(index, value) {
        switch (index) {
        case 0:
            this.x = value;
            break;
        default:
            this.y = value;
        }
    }

    arrayGet(index) {
        switch (index) {
        case 0:
            return this.x;
        default:
            return this.y;
        }
    }

    // this + v === result
    addInPlace(v, result) {
        result.x = this.x + v.x;
        result.y = this.y + v.y;
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    // this - v === result
    subtractInPlace(v, result) {
        result.x = this.x - v.x;
        result.y = this.y - v.y;
    }

    subtract(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    multiplyInPlace(s, result) {
        result.x = this.x * s;
        result.y = this.y * s;
    }

    multiply(s) {
        return new Vec2(this.x * s, this.y * s);
    }

    divideInPlace(s, result) {
        result.x = this.x / s;
        result.y = this.y / s;
    }

    divide(s) {
        return new Vec2(this.x / s, this.y / s);
    }

    dotInPlace(v, result) {
        result.x = this.x * v.x;
        result.y = this.y * v.y;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    get length() {
        return Math.sqrt(this.dot(this));
    }

    getDistanceSquared(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    getDistance(v) {
        return Math.sqrt(this.getDistanceSquared(v));
    }

    getManhattenDistance(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }

    getSquareCircleDistance(v) {
        return Math.max(Math.abs(this.x - v.x), Math.abs(this.y - v.y));
    }

    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }
}

Vec2.X_IDX = 0;
Vec2.Y_IDX = 1;
Vec2.getOtherIndex = (index) => {
    return 1 - index;
}
Vec2.createFromRadial = (angle, length) => {
    return new Vec2((length * Math.cos(angle)), (length * Math.sin(angle)));
}
Vec2.createRandomUnitVector = () => {
    return Vec2.createFromRadial((Math.random() * Math.PI * 2), 1);
}
