export const SQRT2 = Math.sqrt(2);

export function constrain(min, x, max) {
    return Math.min(Math.max(x, min), max);
}
