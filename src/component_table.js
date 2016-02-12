import {Components} from './components.js';
import {assert} from './assert.js';

/* A data structure that can store at most 1 of each
 * type of component, and retrieve components by their
 * type
 */
export class ComponentTable {
    constructor() {
        this.length = Components.length;
        this.components = new Array(this.length);
        this.clear();
    }

    *[Symbol.iterator]() {
        for (let component of this.components) {
            if (component !== null) {
                yield component;
            }
        }
    }

    /* Remove all values */
    clear() {
        for (let i = 0; i < this.length; ++i) {
            this.components[i] = null;
        }
    }

    /* Takes a component type and returns
     * the stored component of that type or null
     * if no such component is stored
     */
    get(component) {
        return this.components[component.type];
    }

    /* Associate a value with a given component */
    set(component, value) {
        let index;
        if (typeof component === 'number') {
            index = component;
        } else {
            index = component.type;
        }

        assert(index !== undefined);

        this.components[index] = value;
    }

    /* Stores a given component, replacing the stored
     * component of that type if one exists already
     */
    add(component) {
        this.components[component.type] = component;
    }

    /* Returns true iff a component of the given type
     * is stored
     */
    has(component) {
        return this.components[component.type] !== null;
    }

    /* Removes a component of a given type if such a
     * component is stored
     */
    remove(component) {
        this.components[component.type] = null;
    }

    /* Calls f on stored component of a given type
     * if such a component is stored
     */
    with(component, f) {
        let c = this.components[component.type];
        if (c !== null) {
            f(c);
        }
    }
}
