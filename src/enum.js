import {isArray} from './array.js';

class Enumeration {
    constructor(object) {
        this.keys = Object.keys(object);
        this.values = [for (key of this.keys) object[key]];

        for (let key of this.keys) {
            this[key] = object[key];
        }

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
