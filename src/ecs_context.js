import {Entity} from './entity.js';
import {assert} from './assert.js';

export class EcsContext {
    constructor() {
        this.entities = new Set();
    }

    makeEntity(iterable = []) {
        let entity = new Entity(iterable);
        this.addEntity(entity);
        return entity;
    }

    addEntity(entity) {
        assert(entity.ecsContext === null);
        entity.ecsContext = this;
        this.entities.add(entity);
    }
}
