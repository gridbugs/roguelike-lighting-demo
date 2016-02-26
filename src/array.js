import * as Random from './random.js';

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
