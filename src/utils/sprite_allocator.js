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

        this.xOffset = 0;
        this.yOffset = 0;
        this.nextCol = 0;
        this.nextRow = 0;
    }

    get full() {
        return this.count == this.maxNumSprites;
    }

    newLine() {
        this.nextCol = 0;
        this.nextRow++;
    }

    getNextOffset() {
        assert(!this.full);
        if (this.nextCol == this.numCols) {
            this.newLine();
        }
        this.xOffset = this.nextCol * this.tileWidth;
        this.yOffset = this.nextRow * this.tileHeight;
        this.nextCol++;
        this.count++;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    flush() {
        this.count = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.nextCol = 0;
        this.nextRow = 0;
    }

    allocate() {

        if (this.full) {
            return null;
        }

        this.getNextOffset();

        let sprite = new Sprite(
                this.ctx,
                this.xOffset * this.tileWidth, this.yOffset * this.tileHeight,
                this.tileWidth, this.tileHeight);


        return sprite;
    }
}
