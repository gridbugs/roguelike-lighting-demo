import {isArray} from 'utils/array_utils';
import {Entity} from 'engine/entity';

/* An embedded domain specific language for mutating the game state */

class Change {
    getEntity(ecsContext) {
        return this.entity;
    }
}

export class AddEntity extends Change {
    constructor(entity) {
        super();
        if (isArray(entity)) {
            entity = new Entity(entity);
        }
        this.entity = entity;
    }

    apply(ecsContext) {
        ecsContext.addEntity(this.entity);
        return this.entity;
    }
}

export class RemoveEntity extends Change {
    constructor(entity) {
        super();
        this.entity = entity;
    }

    apply(ecsContext) {
        ecsContext.removeEntity(this.entity);
    }
}

export class AddComponent extends Change {
    constructor(entity, componentType, ...args) {
        super();
        this.entity = entity;
        this.componentType = componentType;
        this.args = args;
    }

    apply(ecsContext) {
        let component = new this.componentType(...this.args);
        this.entity.add(component);
        return component;
    }
}

export class RemoveComponent extends Change {
    constructor(entity, componentType) {
        super();
        this.entity = entity;
        this.componentType = componentType;
    }

    apply(ecsContext) {
        this.entity.remove(this.componentType);
    }
}

export class SetComponentField extends Change {
    constructor(entity, componentType, field, value) {
        super();
        this.entity = entity;
        this.componentType = componentType;
        this.field = field;
        this.value = value;
    }

    apply(ecsContext) {
        this.entity.get(this.componentType).fields[this.field] = this.value;
    }
}

export class UpdateComponentFieldInPlace extends Change {
    constructor(entity, componentType, field, fn) {
        super();
        this.entity = entity;
        this.componentType = componentType;
        this.field = field;
        this.fn = fn;
    }

    apply(ecsContext) {
        this.fn(this.entity.get(this.componentType).fields[this.field]);
    }
}

export class Bind extends Change {
    constructor(id, change) {
        super();
        this.id = id;
        this.change = change;
    }

    getEntity(ecsContext) {
        return this.change.getEntity(ecsContext);
    }

    apply(ecsContext) {
        let result = this.change.apply(ecsContext);
        ecsContext.bindings[this.id] = result;
        return result;
    }
}

export class Refer extends Change {
    constructor(id, fn) {
        super();
        this.id = id;
        this.fn = fn;
        this.change = null;
    }

    _maybeResolveChange(ecsContext) {
        if (this.change == null) {
            let reference = ecsContext.bindings[this.id];
            this.change = this.fn(reference);
        }
    }

    getEntity(ecsContext) {
        this._maybeResolveChange(ecsContext);
        return this.change.getEntity(ecsContext);
    }

    apply(ecsContext) {
        this._maybeResolveChange(ecsContext);
        return this.change.apply(ecsContext);
    }
}
