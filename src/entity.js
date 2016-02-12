import {ComponentTable} from './component_table.js';
import {assert} from './assert.js';

export class Entity extends ComponentTable {
    constructor(components = []) {
        super();

        /* Reference to the ecsContext currently managing this entity */
        this.ecsContext = null;

        /* Optimization: For entities with Position components, this stores a reference
         * to the cell in the managing context's spacial hash currently occupied by
         * this entity. This should be null for entities with no Position component
         * or which aren't managed by an ecs context. */
        this.cell = null;

        for (let component of components) {
            this.add(component);
        }
    }

    is(component) {
        return this.has(component);
    }

    add(component) {
        assert(!this.has(component));

        super.add(component);
        if (this.ecsContext !== null) {
            component.onAdd(this);
        }
        if (this.cell !== null) {
            this.cell.incrementSingleComponent(component);
        }
    }

    remove(component) {
        assert(this.has(component));

        super.remove(component);
        if (this.ecsContext !== null) {
            component.onRemove(this);
        }
        if (this.cell !== null) {
            this.cell.decrementSingleComponent(component);
        }
    }

    onAdd(ecsContext) {
        assert(this.ecsContext === null);
        this.ecsContext = ecsContext;
        for (let component of this) {
            component.onAdd(this);
        }
    }

    onRemove(ecsContext) {
        assert(this.ecsContext !== null);
        assert(this.ecsContext === ecsContext);
        this.ecsContext = null;
        for (let component of this) {
            component.onRemove(this);
        }
    }
}
