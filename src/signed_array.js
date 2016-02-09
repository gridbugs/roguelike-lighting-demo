export class SignedArray {
    constructor() {
        this.positive = [];
        this.negative = [];
        this.zero = null;
    }

    set(index, value) {
        if (index > 0) {
            this.positive[index - 1] = value;
        } else if (index < 0) {
            this.negative[-index - 1] = value;
        } else { /* index == 0 */
            this.zero = value;
        }
    }

    get(index) {
        if (index > 0) {
            return this.positive[index - 1];
        } else if (index < 0) {
            return this.negative[-index - 1];
        } else { /* index == 0 */
            return this.zero;
        }
    }

    *iterate(start, size) {
        for (let i = start; i < start + size; ++i) {
            yield this.get(i);
        }
    }
}
