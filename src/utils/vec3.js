import {Vec} from 'utils/vec';

export class Vec3 extends Vec {
    constructor(x, y, z) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        if (typeof x == 'number') {
            this.x = x;
            this.y = y;
            this.z = z;
        } else {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    divideInPlace(s, result) {
        result.x = this.x / s;
        result.y = this.y / s;
        result.z = this.z / s;
    }

    divide(s) {
        return new Vec3(this.x / s, this.y / s, this.z / s);
    }

    getDistanceSquared(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }

    // this - v == result
    subtractInPlace(v, result) {
        result.x = this.x - v.x;
        result.y = this.y - v.y;
        result.z = this.z - v.z;
    }

    subtract(v) {
        return new Vec2(this.x - v.x, this.y - v.y, this.z - v.z);
    }
}
