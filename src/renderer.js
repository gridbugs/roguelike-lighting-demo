import {BestTracker} from './best_tracker.js';
import {CellGrid, Cell} from './cell_grid.js';
import {Components} from './components.js';
import {Direction} from './direction.js';
import {assert} from './assert.js';

function compare(a, b) {
    return a.depth - b.depth;
}

class RendererCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.tiles = new BestTracker(compare);
        this.backgrounds = new BestTracker(compare);
        this.tileComponent = null;
        this.tile = null;
        this.background = null;
    }
}

class RendererGrid extends CellGrid(RendererCell) {}

export class Renderer {
    constructor(ecs, drawer) {
        this.drawer = drawer;
        this.ecs = ecs;
        this.grid = new RendererGrid(ecs.spacialHash.width, ecs.spacialHash.height);
    }

    maybeAddTile(rendererCell, entity) {
        entity.with(Components.Tile, (tile) => {
            rendererCell.tiles.insert(tile);
            if (!tile.tile.transparentBackground) {
                rendererCell.backgrounds.insert(tile);
            }
        });
        entity.with(Components.WallTile, (tile) => {
            rendererCell.tiles.insert(tile);
        });
    }

    updateGrid() {
        for (let cell of this.ecs.spacialHash) {
            let rendererCell = this.grid.get(cell.coord);

            rendererCell.tiles.clear();
            rendererCell.backgrounds.clear();

            for (let entity of cell.entities) {
                this.maybeAddTile(rendererCell, entity);
            }
        }
    }

    processGrid() {
        for (let rendererCell of this.grid) {
            if (rendererCell.tiles.empty) {
                continue;
            }

            /* Save the foreground */
            let best = rendererCell.tiles.best;
            rendererCell.tileComponent = best;

            if (best.is(Components.Tile)) {
                rendererCell.tile = best.tile;

                let above = rendererCell.getNeighbour(Direction.North);
                if (above !== null && above.tileComponent.is(Components.WallTile)) {
                    above.tile = above.tileComponent.frontTile;
                }
            } else {
                assert(best.is(Components.WallTile));
                rendererCell.tile = best.topTile;
            }

            /* Save the background if necessary */
            if (best.is(Components.Tile) && best.tile.transparentBackground &&
                    !rendererCell.backgrounds.empty) {

                rendererCell.background = rendererCell.backgrounds.best.tile.background;
            } else {
                rendererCell.background = null;
            }
        }
    }

    renderGrid() {
        for (let rendererCell of this.grid) {
            if (rendererCell.background !== null) {
                this.drawer.drawTile(rendererCell.background, rendererCell.x, rendererCell.y);
            }
            if (rendererCell.tile !== null) {
                this.drawer.drawTile(rendererCell.tile, rendererCell.x, rendererCell.y);
            }
        }
    }

    run() {
        this.updateGrid();
        this.processGrid();
        this.renderGrid();
    }
}
