import {CellGrid, Cell} from './cell_grid.js';
import {Components} from './components.js';
import {InvalidatingComponentTable} from './invalidating_component_table';
import {ComponentTable} from './component_table.js';
import {ObjectPool} from './object_pool.js';
import {BestTracker} from './best_tracker.js';

class EntityMemory extends InvalidatingComponentTable {
    constructor(cell) {
        super();

        this.cell = cell;

        if (EntityMemory.RememberedComponents === null) {
            EntityMemory.RememberedComponents = [
                Components.Position,
                Components.Tile,
                Components.WallTile,
                Components.Solid,
                Components.PlayerCharacter,
                Components.Burning,
                Components.Health,
                Components.MaxHealth
            ];
        }
    }

    see(entity) {
        for (let component of EntityMemory.RememberedComponents) {
            if (entity.has(component)) {
                this.add(entity.get(component));
                this.cell.componentTable.set(component, true);
            }
        }
    }

    hasBackground() {
        if (this.has(Components.WallTile)) {
            return true;
        }
        if (this.has(Components.Tile)) {
            return !this.get(Components.Tile).tile.transparentBackground;
        }
        return false;
    }
}
EntityMemory.RememberedComponents = null;

function getDepth(e) {
    if (e.has(Components.Tile)) {
        return e.get(Components.Tile).depth;
    } else if (e.has(Components.WallTile)) {
        return e.get(Components.WallTile).depth;
    }
    throw Error("no component with depth");
}

function compare(a, b) {
    return getDepth(a) - getDepth(b);
}

class KnowledgeCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.turn = -1;
        this.known = false;
        this.entityMemoryPool = new ObjectPool(EntityMemory, this);
        this.topEntityMemory = new BestTracker(compare);
        this.topBackgroundEntityMemory = new BestTracker(compare);
        this.componentTable = new ComponentTable();
    }

    *[Symbol.iterator]() {
        yield* this.entityMemoryPool;
    }

    get visible() {
        return this.turn === this.grid.ecsContext.turn;
    }

    see(entity) {
        let entityMemory = this.entityMemoryPool.allocate();
        entityMemory.invalidate();
        entityMemory.see(entity);
        this.topEntityMemory.insert(entityMemory);
        if (entityMemory.hasBackground()) {
            this.topBackgroundEntityMemory.insert(entityMemory);
        }
        this.known = true;
        this.turn = this.grid.ecsContext.turn;
    }

    clear() {
        this.entityMemoryPool.flush();
        this.topEntityMemory.clear();
        this.topBackgroundEntityMemory.clear();
        this.componentTable.clear();
    }

    has(component) {
        return this.componentTable.has(component);
    }

    is(component) {
        return this.componentTable.is(component);
    }

    find(component) {
        if (this.has(component)) {
            for (let entity of this) {
                if (entity.is(component)) {
                    return entity;
                }
            }
        }
        return null;
    }

    withEntity(component, callback) {
        let entity = this.find(component);
        if (entity !== null) {
            callback(entity);
        }
    }
}

class KnowledgeGrid extends CellGrid(KnowledgeCell) {
    constructor(ecsContext, knowledge) {
        super(ecsContext.width, ecsContext.height);
        this.ecsContext = ecsContext;
        this.knowledge = knowledge;
        if (knowledge.familiar) {
            for (let entity of ecsContext.entities) {
                let knowledgeCell = this.get(entity.cell.coord);
                if (!entity.is(Components.Unfamiliar)) {
                    knowledgeCell.see(entity);
                    knowledgeCell.turn = -1;
                }
            }
        }
    }
}

export class Knowledge {
    constructor(familiar = false) {
        this.gridTable = [];
        this.familiar = familiar;
    }

    maybeAddEcsContext(ecsContext) {
        if (this.gridTable[ecsContext.id] === undefined) {
            this.gridTable[ecsContext.id] = new KnowledgeGrid(ecsContext, this);
        }
    }

    getGrid(ecsContext) {
        this.maybeAddEcsContext(ecsContext);
        return this.gridTable[ecsContext.id];
    }
}
