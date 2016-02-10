import {Components} from './components.js';

export class Entity {
    constructor(iterable = []) {
        this.ecsContext = null;
        this.components = new Array(Components.length);
        for (let i = 0; i < Components.length; ++i) {
            this.components[i] = null;
        }
        for (let c of iterable) {
            this.components[c.type] = c;
        }
    }

    get(component) {
        return this.components[component.type];
    }

    has(component) {
        return this.get(component) !== null;
    }

    is(component) {
        return this.has(component);
    }

    with(component, f) {
        let c = this.get(component);
        if (c !== null) {
            f(c);
        }
    }
}
