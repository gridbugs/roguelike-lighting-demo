export class AddEntity {
    constructor(entity) {
        this.entity = entity;
    }

    apply(ecsContext) {
        ecsContext.addEntity(this.entity);
    }
}

export class RemoveEntity {
    constructor(entity) {
        this.entity = entity;
    }

    apply(ecsContext) {
        ecsContext.removeEntity(ecsContext);
    }
}

export class AddComponent {
    constructor(entity, componentType, ...args) {
        this.entity = entity;
        this.componentType = componentType;
        this.args = args;
    }

    apply(ecsContext) {
        this.entity.add(new this.componentType(...this.args));
    }
}

export class RemoveComponent {
    constructor(entity, componentType) {
        this.entity = entity;
        this.componentType = componentType;
    }

    apply(ecsContext) {
        this.entity.remove(this.componentType);
    }
}

export class SetComponentField {
    constructor(entity, componentType, field, value) {
        this.entity = entity;
        this.componentType = componentType;
        this.field = field;
        this.value = value;
    }

    apply(ecsContext) {
        this.entity.get(this.componentType).fields[this.field] = this.value;
    }
}

export class UpdateComponentFieldInPlace {
    constructor(entity, componentType, field, fn) {
        this.entity = entity;
        this.componentType = componentType;
        this.field = field;
        this.fn = fn;
    }

    apply(ecsContext) {
        this.fn(this.entity.get(this.componentType).fields[this.field]);
    }
}
