import {Entity} from './entity.js';

import {CellGrid, Cell} from './cell_grid.js';
import {ComponentCountingEntitySet} from './entity_set.js';

import {Config} from './config.js';
import {assert} from './assert.js';

class SpacialHashCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.entities = new ComponentCountingEntitySet();
    }

    has(component) {
        return this.entities.hasComponent(component);
    }

    is(component) {
        return this.entities.isComponent(component);
    }
}

class SpacialHash extends CellGrid(SpacialHashCell) {}

export class EcsContext {
    constructor() {
        this.entities = new Set();
        this.spacialHash = new SpacialHash(Config.GRID_WIDTH, Config.GRID_HEIGHT);
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
