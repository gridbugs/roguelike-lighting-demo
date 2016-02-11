import {ComponentTable} from './component_table.js';

export class Entity extends ComponentTable {
    constructor(iterable = []) {
        super();

        this.ecsContext = null;
        for (let component of iterable) {
            this.set(component);
        }
    }

    is(component) {
        return this.has(component);
    }
}
