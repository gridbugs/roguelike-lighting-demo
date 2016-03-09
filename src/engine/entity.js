import {ComponentTable} from 'engine/component_table';
import {assert} from 'utils/assert';

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

    add(component) {
        assert(!this.has(component));

        super.add(component);
        if (this.ecsContext !== null) {
            component.onAdd(this);
        }
        if (this.cell !== null) {
            this.cell.entities.incrementSingleComponent(component);
        }
        this.updateCellTurn();
    }

    remove(component) {
        assert(this.has(component));

        this.updateCellTurn();

        if (this.ecsContext !== null) {
            this.get(component).onRemove(this);
        }
        super.remove(component);
        if (this.cell !== null) {
            this.cell.entities.decrementSingleComponent(component);
        }
    }

    onAdd(ecsContext) {
        assert(this.ecsContext === null);
        this.ecsContext = ecsContext;
        for (let component of this) {
            component.onAdd(this);
        }
        this.updateCellTurn();
    }

    onRemove(ecsContext) {
        assert(this.ecsContext !== null);
        assert(this.ecsContext === ecsContext);

        this.updateCellTurn();

        for (let component of this) {
            component.onRemove(this);
        }
        this.ecsContext = null;
    }

    become(components) {
        this.updateCellTurn();
        for (let component of this) {
            this.remove(component);
        }
        for (let component of components) {
            this.add(component);
        }
        this.updateCellTurn();
    }

    updateCellTurn() {
        if (this.cell !== null) {
            this.cell.turn = this.ecsContext.turn;
        }
    }
}
