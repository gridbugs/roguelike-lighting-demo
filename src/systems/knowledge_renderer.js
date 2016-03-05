import {System} from 'engine/system';

import {Components} from 'components';
import {Tiles} from 'tiles';

import {Direction} from 'utils/direction';

export class KnowledgeRenderer extends System {
    constructor(ecsContext, drawer) {
        super(ecsContext);
        this.drawer = drawer;
        this.time = this.ecsContext.schedule.absoluteTime;
        this.timeDelta = 0;
    }

    resolveWallTile(entity) {
        /* Get the cell below this one */
        let realCell = this.getCell(entity.cell.coord);
        let south = realCell.getNeighbour(Direction.South);
        if (south === null) {
            return entity.get(Components.WallTile).topTile;
        }
        if (south.has(Components.WallTile)) {
            return entity.get(Components.WallTile).topTile;
        }
        return entity.get(Components.WallTile).frontTile;
    }

    getTileFromEntity(entity, visible) {
        if (entity.has(Components.Tile)) {
            return entity.get(Components.Tile).tile;
        }
        if (entity.has(Components.WallTile)) {
            return this.resolveWallTile(entity);
        }
        if (entity.has(Components.RandomlyAnimatedTile)) {
            let tileComponent = entity.get(Components.RandomlyAnimatedTile);
            if (visible) {
                tileComponent.maybeChange(this.timeDelta);
            }
            return tileComponent.tile;
        }
        if (entity.has(Components.RandomlyChosenTile)) {
            return entity.get(Components.RandomlyChosenTile).tile;
        }
        throw Error('no entity with tile');
    }

    getMainTile(cell, visible) {
        let entity = cell.topEntityMemory.best;
        return this.getTileFromEntity(entity, visible);
    }

    getBackgroundTile(cell, visible) {
        let entity = cell.topBackgroundEntityMemory.best;
        let tile = this.getTileFromEntity(entity, visible);
        return tile.background;
    }

    getHealthBarTile(entity) {
        let maxHealth = entity.get(Components.MaxHealth).value;
        let health = Math.min(entity.get(Components.Health).value, maxHealth);
        let barLength = Math.floor((Tiles.HealthBarSize * health) / maxHealth);
        return Tiles.HealthBars[barLength];
    }

    drawTile(cell) {
        let tile = this.getMainTile(cell, true);
        if (tile.transparentBackground) {
            let backgroundTile = this.getBackgroundTile(cell, true);
            this.drawer.drawTile(backgroundTile, cell.x, cell.y);
            if (cell.is(Components.Burning)) {
                this.drawer.drawTile(Tiles.FireBackground, cell.x, cell.y);
            }
        }
        this.drawer.drawTile(tile, cell.x, cell.y);

        let entity = cell.find(Components.MaxHealth);
        if (entity !== null) {
            this.drawer.drawTile(this.getHealthBarTile(entity), cell.x, cell.y);
        }
    }

    drawGreyTile(cell) {
        let tile = this.getMainTile(cell, false);
        if (tile.transparentBackground) {
            let backgroundTile = this.getBackgroundTile(cell, false);
            this.drawer.drawTile(backgroundTile.greyScale, cell.x, cell.y);
        }
        this.drawer.drawTile(tile.greyScale, cell.x, cell.y);
    }

    run(entity) {
        this.timeDelta = this.ecsContext.schedule.absoluteTime - this.time;
        this.time = this.ecsContext.schedule.absoluteTime;

        this.drawer.clear();

        let observer = entity.get(Components.Observer);
        if (observer !== null) {
            let grid = observer.knowledge.getGrid(this.ecsContext);
            for (let cell of grid) {
                if (!cell.known) {
                    this.drawer.drawTile(Tiles.Unseen, cell.x, cell.y);
                } else if (cell.visible) {
                    this.drawTile(cell);
                } else {
                    this.drawGreyTile(cell);
                }
            }
        };
    }
}
