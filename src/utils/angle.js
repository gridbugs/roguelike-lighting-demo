import {normalizeToRangeMaxInclusive} from 'utils/normalize';
import {PI, NEGATIVE_PI, DEGREES_PER_RADIAN} from 'utils/constants';

export function degreesToRadians(degrees) {
    return degrees / DEGREES_PER_RADIAN;
}

export function radiansToDegrees(radians) {
    return radians * DEGREES_PER_RADIAN;
}

/* Takes an angle in radians, and returns an angle in radians x
 * such that -pi < x <= pi */
export function normalize(radians) {
    return normalizeToRangeMaxInclusive(radians, NEGATIVE_PI, PI);
}
