import {CellGrid, Cell} from 'utils/cell_grid';
import {Sprite} from 'utils/sprite';

class DrawerCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.sprite = new Sprite(grid.ctx,
                                 x * grid.tileWidth, y * grid.tileHeight,
                                 grid.tileWidth, grid.tileHeight);
    }
}

export function DrawerGrid(T) {
    return class DrawerGridInstance extends CellGrid(T) {
        constructor(ctx, tileWidth, tileHeight) {
            super(Math.floor(ctx.canvas.width / tileWidth), Math.floor(ctx.canvas.height / tileHeight));
            this.ctx = ctx;
            this.canvas = ctx.canvas;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;
        }
    }
}
