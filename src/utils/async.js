import {isArray} from 'utils/array_utils';

export function resolvePromiseStructure(structure, results) {
    if (isArray(structure)) {
        return resolvePromiseArray(structure, results);
    } else {
        return resolvePromiseObject(structure, results);
    }
}

function resolvePromiseArray(array, results) {
    return new Promise((resolve, reject) => {
        let count = array.length;
        if (results === undefined) {
            results = new Array(array.length);
        }
        for (let i = 0; i < array.length; ++i) {
            (function(index) {
                let promise = array[index];
                if (!(promise instanceof Promise)) {
                    promise = resolvePromiseStructure(promise);
                }
                promise.then((result) => {
                    --count;
                    results[index] = result;
                    if (count === 0) {
                        resolve(results);
                    }
                });
            })(i);
        }
    });
}

function resolvePromiseObject(object, results) {
    return new Promise((resolve, reject) => {
        if (results === undefined) {
            results = {};
        }
        let keys = Object.keys(object);
        let count = keys.length;
        for (let k of keys) {
            (function(key) {
                let promise = object[key];
                if (!(promise instanceof Promise)) {
                    promise = resolvePromiseStructure(promise);
                }
                promise.then((result) => {
                    --count;
                    results[key] = result;
                    if (count === 0) {
                        resolve(results);
                    }
                });
            })(k);
        }
    });
}
