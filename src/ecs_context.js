import {Entity} from './entity.js';
import {SpacialHash} from './spacial_hash.js';
import {Config} from './config.js';
import {assert} from './assert.js';

export class EcsContext {
    constructor() {
        this.entities = new Set();
        this.spacialHash = new SpacialHash(Config.GRID_WIDTH, Config.GRID_HEIGHT);
        console.debug(this);
    }

    emplaceEntity(components = []) {
        let entity = new Entity(components);
        this.addEntity(entity);
        return entity;
    }

    addEntity(entity) {
        assert(entity.ecsContext === null);
        this.entities.add(entity);
        entity.onAdd(this);
    }

    removeEntity(entity) {
        assert(entity.ecsContext === this);
        this.entities.delete(entity);
        entity.onRemove(this);
    }
}
