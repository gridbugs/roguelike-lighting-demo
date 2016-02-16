export function constrain(min, x, max) {
    return Math.min(Math.max(x, min), max);
}
