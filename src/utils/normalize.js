/* Returns the decimal component of x / y */
function calculateQuotientDecimal(x, y) {
    let quotient = x / y;
    return quotient - Math.floor(quotient);
}

/* Takes a number x, and a positive number max, and returns a number y such that
 * y => 0 && y < max && x == y + k * max for some non-negative integer k */
export function normalizeToPositiveMaxExclusive(x, max) {
    return calculateQuotientDecimal(x, max) * max;
}

/* Takes a number x, and a positive number max, and returns a number y such that
 * y > 0 && y <= max && x == y + k * max for some non-negative integer k */
export function normalizeToPositiveMaxInclusive(x, max) {
    let quotientDecimal = calculateQuotientDecimal(x, max);
    if (quotientDecimal == 0) {
        return max;
    } else {
        return quotientDecimal * max;
    }
}

/* Returns a number y such that:
 *
 * min < y <= max
 *
 * there exists an integer k such that x == min + (max - min) * k + y
 */
export function normalizeToRangeMinInclusive(x, min, max) {
    return normalizeToPositiveMaxExclusive(x - min, max - min) + min;
}

/* Returns a number y such that:
 *
 * min <= y < max
 *
 * there exists an integer k such that x == min + (max - min) * k + y
 */
export function normalizeToRangeMaxInclusive(x, min, max) {
    return normalizeToPositiveMaxInclusive(x - min, max - min) + min;
}
