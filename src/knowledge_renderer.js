import {System} from './system.js';

import {Components} from './components.js';
import {Tiles} from './tiles.js';

import {Direction} from './direction.js';

export class KnowledgeRenderer extends System {
    constructor(ecsContext, drawer) {
        super(ecsContext);
        this.drawer = drawer;
    }

    resolveWallTile(entity) {
        /* Get the cell below this one */
        let realCell = this.spacialHash.get(entity.cell.coord);
        let south = realCell.getNeighbour(Direction.South);
        if (south === null) {
            return entity.get(Components.WallTile).topTile;
        }
        if (south.has(Components.WallTile)) {
            return entity.get(Components.WallTile).topTile;
        }
        return entity.get(Components.WallTile).frontTile;
    }

    getTileFromEntity(entity) {
        if (entity.has(Components.Tile)) {
            return entity.get(Components.Tile).tile;
        }
        if (entity.has(Components.WallTile)) {
            return this.resolveWallTile(entity);
        }
        throw Error('no entity with tile');
    }

    getMainTile(cell) {
        let entity = cell.topEntityMemory.best;
        return this.getTileFromEntity(entity);
    }

    getBackgroundTile(cell) {
        let entity = cell.topBackgroundEntityMemory.best;
        let tile = this.getTileFromEntity(entity);
        return tile.background;
    }

    drawTile(cell) {
        let tile = this.getMainTile(cell);
        if (tile.transparentBackground) {
            let backgroundTile = this.getBackgroundTile(cell);
            this.drawer.drawTile(backgroundTile, cell.x, cell.y);
        }
        this.drawer.drawTile(tile, cell.x, cell.y);
    }

    drawGreyTile(cell) {
        let tile = this.getMainTile(cell);
        if (tile.transparentBackground) {
            let backgroundTile = this.getBackgroundTile(cell);
            this.drawer.drawTile(backgroundTile.greyScale, cell.x, cell.y);
        }
        this.drawer.drawTile(tile.greyScale, cell.x, cell.y);
    }

    run(entity) {
        this.drawer.clear();

        entity.with(Components.Observer, (observer) => {
            let grid = observer.knowledge.getGrid(this.ecsContext);
            for (let cell of grid) {
                if (cell.turn === -1) {
                    this.drawer.drawTile(Tiles.Unseen, cell.x, cell.y);
                } else if (cell.turn === this.ecsContext.turn) {
                    this.drawTile(cell);
                } else {
                    this.drawGreyTile(cell);
                }
            }
        });
    }
}
