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

    resolveWallTile(entity, grid) {
        /* Get the cell below this one */
        let cell = grid.get(entity.cell.coord);
        let south = cell.getNeighbour(Direction.South);
        if (south === null) {
            return entity.get(Components.WallTile).topTile;
        }
        if (south.has(Components.WallTile)) {
            return entity.get(Components.WallTile).topTile;
        }
        return entity.get(Components.WallTile).frontTile;
    }

    getTileFromEntity(entity, visible, grid) {
        if (entity.has(Components.Tile)) {
            return entity.get(Components.Tile).tile;
        }
        if (entity.has(Components.WallTile)) {
            return this.resolveWallTile(entity, grid);
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

    getMainTile(cell, visible, grid) {
        let entity = cell.topEntityMemory.best;
        return this.getTileFromEntity(entity, visible, grid);
    }

    getBackgroundTile(cell, visible) {
        let entity = cell.topBackgroundEntityMemory.best;
        let tile = this.getTileFromEntity(entity, visible);
        return tile.background;
    }

    getHealthBarTile(entity) {
        let maxHealth = entity.get(Components.MaxHealth).value;
        let health = Math.max(Math.min(entity.get(Components.Health).value, maxHealth), 0);
        /* 1 less than length as the array includes empty and full health bars */
        let healthBarSize = Tiles.HealthBar.length - 1;
        let barLength = Math.floor((healthBarSize * health) / maxHealth);
        return Tiles.HealthBar[barLength];
    }

    drawTile(cell, grid) {
        let tile = this.getMainTile(cell, true, grid);
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

        let atmosphereCell = this.ecsContext.atmosphere.grid.get(cell.coord);
        if (atmosphereCell.atmosphere === 0 && !cell.is(Components.Void)) {
            this.drawer.drawTile(Tiles.VacuumOverlay, cell.x, cell.y);
        }
        if (atmosphereCell.venting) {
            this.drawer.drawTile(Tiles.VentingOverlay, cell.x, cell.y);
        }
    }

    drawGreyTile(cell, grid) {
        let tile = this.getMainTile(cell, false, grid);
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
                    this.drawTile(cell, grid);
                } else {
                    this.drawGreyTile(cell, grid);
                }
            }
        };
    }
}
