import {CellGrid, Cell} from 'utils/cell_grid';
import {Components} from 'components';
import {InvalidatingComponentTable} from 'engine/invalidating_component_table';
import {ComponentTable} from 'engine/component_table';
import {ObjectPool} from 'utils/object_pool';
import {BestTracker} from 'utils/best_tracker';
import {getTileComponentDepth} from 'components/tile_component';

class EntityMemory extends InvalidatingComponentTable {
    constructor(cell) {
        super();

        this.cell = cell;

        if (EntityMemory.RememberedComponents === null) {
            EntityMemory.RememberedComponents = [
                Components.Position,
                Components.Tile,
                Components.WallTile,
                Components.RandomlyAnimatedTile,
                Components.RandomlyChosenTile,
                Components.Solid,
                Components.PlayerCharacter,
                Components.Burning,
                Components.Health,
                Components.MaxHealth,
                Components.Door,
                Components.Name,
                Components.Description,
                Components.Weapon,
                Components.Void
            ];
        }
    }

    see(entity) {
        for (let i = 0; i < EntityMemory.RememberedComponents.length; ++i) {
            let component = EntityMemory.RememberedComponents[i];
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
        if (this.has(Components.RandomlyAnimatedTile)) {
            return !this.get(Components.RandomlyAnimatedTile).tile.transparentBackground;
        }
        if (this.has(Components.RandomlyChosenTile)) {
            return !this.get(Components.RandomlyChosenTile).tile.transparentBackground;
        }
        return false;
    }

    add(component) {
        let c = super.add(component);
        c.entity = this;
    }
}
EntityMemory.RememberedComponents = null;

function compare(a, b) {
    let aDepth = getTileComponentDepth(a);
    let bDepth = getTileComponentDepth(b);
    if (aDepth === null || bDepth === null) {
        throw 'entity has no component with depth';
    }
    return aDepth - bDepth;
}

class KnowledgeCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.turn = -1;
        this.known = false;
        this.entityMemoryPool = new ObjectPool(EntityMemory, 10, this);
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
                if (entity.cell !== null) {
                    let knowledgeCell = this.get(entity.cell.coord);
                    if (!entity.is(Components.Unfamiliar)) {
                        knowledgeCell.see(entity);
                        knowledgeCell.turn = -1;
                    }
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
