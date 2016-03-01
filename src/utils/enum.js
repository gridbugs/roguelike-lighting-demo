import {isArray} from './array_utils.js';

class Enumeration {
    constructor(object) {
        this.keys = Object.keys(object);
        this.values = [for (key of this.keys) object[key]];

        let count = 0;
        for (let key of this.keys) {
            this[key] = object[key];
            ++count;
        }

        this.length = count;

        Object.freeze(this);
    }
}

export function makeIntEnumObject(array) {
    let object = {};
    let i = 0;
    for (let key of array) {
        object[key] = i;
        ++i;
    }
    return object;
}

export function makeEnumObject(array) {
    let object = {};
    for (let key of array) {
        object[key] = key;
    }
    return object;
}

export function makeEnum(x, ints=false) {
    if (isArray(x)) {
        let object;
        if (ints) {
            object = makeIntEnumObject(x);
        } else {
            object = makeEnumObject(x);
        }
        return new Enumeration(object);
    } else {
        return new Enumeration(x);
    }
}

export function substituteValues(enumeration, object) {
    for (let key in object) {
        object[key] = enumeration[object[key]];
    }
    return object;
}

export function makeTable(enumeration, object) {
    let table = [];
    for (let key in object) {
        table[enumeration[key]] = object[key];
    }
    return table;
}
