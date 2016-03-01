import {Vec2} from 'utils/vec2.js';
import {getRandomElement} from 'utils/array_utils.js';

export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.limits = new Vec2(width - 1, height - 1);

        this.size = width * height;
        this.array = new Array(this.size);
    }

    _toIndex(x, y) {
        return x + y * this.width;
    }

    isValid(x, y) {
        if (typeof x === 'number') {
            return x >= 0 && y >= 0 && x < this.width && y < this.height;
        } else {
            return x.x >= 0 && x.y >= 0 && x.x < this.width && x.y < this.height;
        }
    }

    isBorder(x, y) {
        if (typeof x === 'number') {
            return x === 0 || y === 0 || x === this.limits.x || y === this.limits.y;
        } else {
            return x.x === 0 || x.y === 0 || x.x === this.limits.x || x.y === this.limits.y;
        }
    }

    getDistanceToEdge(x, y) {
        if (typeof x === 'number') {
            return Math.min(x, y, this.limits.x - x, this.limits.y - y);
        } else {
            return Math.min(x.x, x.y, this.limits.x - x.x, this.limits.y - x.y);
        }
    }

    with(x, y, f) {
        if (this.isValid(x, y)) {
            f(this.get(x, y));
        }
    }

    get(x, y) {
        if (!this.isValid(x, y)) {
            return null;
        }
        let ret;
        if (typeof x === 'number') {
            ret = this.array[this._toIndex(x, y)];
        } else {
            ret = this.array[this._toIndex(x.x, x.y)];
        }
        if (ret === undefined) {
            return null;
        }
        return ret;
    }

    set(x, y, value) {
        if (typeof x === 'number') {
            this.array[this._toIndex(x, y)] = value;
        } else {
            this.array[this._toIndex(x.x, x.y)] = y;
        }
    }

    *[Symbol.iterator]() {
        yield* this.array;
    }

    *border(depth = 0) {
        let xLimit = this.limits.x - depth;
        let yLimit = this.limits.y - depth;

        for (let i = depth; i <= xLimit; ++i) {
            yield this.get(i, depth);
        }
        for (let i = depth + 1; i <= yLimit; ++i) {
            yield this.get(xLimit, i);
        }
        for (let i = xLimit - 1; i > depth; --i) {
            yield this.get(i, yLimit);
        }
        for (let i = yLimit; i > depth; --i) {
            yield this.get(depth, i);
        }
    }

    *edge() {
        for (let i = 1; i < this.limits.x; ++i) {
            yield this.get(i, 0);
            yield this.get(i, this.limits.y);
        }
        for (let i = 1; i < this.limits.y; ++i) {
            yield this.get(0, i);
            yield this.get(this.limits.x, i);
        }
    }

    *coords() {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                yield new Vec2(x, y);
            }
        }
    }

    getRandom() {
        return getRandomElement(this.array);
    }
}
