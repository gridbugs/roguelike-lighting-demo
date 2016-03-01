import {getRandomIntInclusive} from 'utils/random';

export function roll(sides = 6, count = 1) {
    let total = 0;
    for (let i = 0; i < count; ++i) {
        total += getRandomIntInclusive(1, sides);
    }
    return total;
}

export class DicePool {
    constructor(sides = 6, count = 1) {
        this.sides = 6;
        this.count = 1;
    }

    roll() {
        return roll(this.sides, this.count);
    }
}
