import {Stack} from 'utils/stack';
import {CellGrid, Cell} from 'utils/cell_grid';
import {ObjectPool} from 'utils/object_pool';
import {Vec2} from 'utils/vec2';

const INITIAL_STACK_SIZE = 4;

class DrawerCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.stack = new Stack(INITIAL_STACK_SIZE);
    }
}

class DrawerGrid extends CellGrid(DrawerCell) {}

export class Drawer {
    constructor(canvas, tileWidth, tileHeight) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.width = Math.floor(this.canvas.width / this.tileWidth);
        this.height = Math.floor(this.canvas.height / this.tileHeight);
        this.grid = new DrawerGrid(this.width, this.height);

        this.dirtyList = new ObjectPool(Vec2);
    }

    clear() {
        this.clearStore();
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }

    drawTile(tile, x, y) {
        this.storeTile(tile, x, y);
        this.drawTileUnstored(tile, x, y);
    }

    drawTileUnstored(tile, x, y) {
        this.ctx.drawImage(
            tile.canvas,
            tile.x, tile.y,
            tile.width, tile.height,
            x * this.tileWidth, y * this.tileHeight,
            tile.width, tile.height
        );
    }

    storeTile(tile, x, y) {
        let cell = this.grid.get(x, y);
        if (cell === null) {
            return; // TODO disconnect the dimensions of the screen from the dimensions of this grid
        }
        if (cell.stack.empty) {
            let dirtyCoord = this.dirtyList.allocate();
            dirtyCoord.set(x, y);
        }
        cell.stack.push(tile);
    }

    clearStore() {
        for (let coord of this.dirtyList) {
            let cell = this.grid.get(coord);
            cell.stack.clear();
        }
        this.dirtyList.flush();
    }

    redraw() {
        for (let coord of this.dirtyList) {
            let cell = this.grid.get(coord);
            for (let tile of cell.stack) {
                this.drawTileUnstored(tile, coord.x, coord.y);
            }
        }
    }

    fill(colour) {
        this.ctx.beginPath();
        this.ctx.fillStyle = colour;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }

    redrawBackgroundTile(x, y) {
        let cell = this.grid.get(x, y);
        let stack = cell.stack;
        this.drawTileUnstored(stack.array[0], x, y);
    }
}
