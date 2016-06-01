import {createCanvasContext} from 'utils/canvas';
import {Sprite} from 'utils/sprite';
import {assert} from 'utils/assert';

export class SpriteAllocator {
    constructor(tileWidth, tileHeight, numCols, numRows) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.numCols = numCols;
        this.numRows = numRows;
        this.width = numCols * tileWidth;
        this.height = numRows * tileHeight;

        this.ctx = createCanvasContext(this.width, this.height);
        this.canvas = this.ctx.canvas;

        this.count = 0;
        this.maxNumSprites = numCols * numRows;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    flush() {
        this.count = 0;
    }

    allocate() {

        assert(this.count < this.maxNumSprites, "Too many sprites allocated");

        let x = this.count % this.numCols;
        let y = Math.floor(this.count / this.numCols);
        let sprite = new Sprite(
                this.ctx,
                x * this.tileWidth, y * this.tileHeight,
                this.tileWidth, this.tileHeight);
        this.count++;

        return sprite;
    }
}
