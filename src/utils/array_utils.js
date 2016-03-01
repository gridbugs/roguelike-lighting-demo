import * as Random from 'utils/random.js';

export function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

export function swapElements(array, i, j) {
    let tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
}

export function getRandomElement(array) {
    return array[Random.getRandomInt(0, array.length)];
}

export function shuffleInPlace(array) {
    for (let i = 0; i < array.length; ++i) {
        let index = Random.getRandomInt(i, array.length);
        swapElements(array, i, index);
    }
}

export function getBestIndex(array, compare = (a, b) => {return a - b}) {
    if (array.length === 0) {
        return null;
    }
    let best = array[0];
    let index = 0;
    for (let i = 1; i < array.length; ++i) {
        if (compare(array[i], best) > 0) {
            best = array[i];
            index = i;
        }
    }
    return index;
}
