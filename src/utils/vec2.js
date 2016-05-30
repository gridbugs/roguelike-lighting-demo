import {Vec} from 'utils/vec';

export class Vec2 extends Vec {
    constructor(x, y) {
        super();

        this.x = x;
        this.y = y;
    }

    set(x, y) {
        if (typeof x == 'number') {
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

    // this + v == result
    addInPlace(v, result) {
        result.x = this.x + v.x;
        result.y = this.y + v.y;
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    // this - v == result
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

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    getDistanceSquared(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    getManhattenDistance(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }

    getSquareCircleDistance(v) {
        return Math.max(Math.abs(this.x - v.x), Math.abs(this.y - v.y));
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    get angle() {
        return this.getAngle();
    }

    getAngleYFlipped() {
        /* In computer graphics, the convention is for the y axis to
         * increase going down. In geometry, the y axis increases
         * going up. When thinking about angles, the convention is
         * for the angle to increase in the anticlockwise direction.
         */
        return Math.atan2(-this.y, this.x);
    }

    get angleYFlipped() {
        return this.getAngleYFlipped();
    }

    equals(v) {
        return this.x == v.x && this.y == v.y;
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
