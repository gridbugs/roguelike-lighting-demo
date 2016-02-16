import {ComponentTable} from './component_table.js';

/* A table of components that clones/copies from added components
 * rather than storing a reference. Removed components are invalidated
 * by setting a flag in the component rather than setting the entry
 * to null. Intended for use when making lightweight copies of
 * entities (by copying some of their components).
 */
export class InvalidatingComponentTable extends ComponentTable {
    get(component) {
        let ret = super.get(component);
        if (ret !== null && ret.valid) {
            return ret;
        } else {
            return null;
        }
    }

    add(component) {
        let c = this.components[component.type];
        if (c === null) {
            this.components[component.type] = component.clone();
        } else {
            component.copyTo(c);
        }
    }

    has(component) {
        let c = this.components[component.type];
        return c !== null && c.valid;
    }

    remove(component) {
        let c = this.components[component.type];
        if (c !== null) {
            c.valid = false;
        }
    }

    with(component, f) {
        let c = this.components[component.type];
        if (c !== null && c.valid) {
            f(c);
        }
    }

    invalidate() {
        for (let i = 0; i < this.length; ++i) {
            let c = this.components[i];
            if (c !== null) {
                c.valid = false;
            }
        }
    }
}
