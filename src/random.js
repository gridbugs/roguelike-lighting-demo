/* Returns a uniformly random integer between
 * low (inclusive) and high (exclusive)
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/* Returns a uniformly random integer between
 * low (inclusive) and high (inclusive)
 */
export function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomBool() {
    return Math.random() < 0.5;
}
