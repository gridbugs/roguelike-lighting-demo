import {Transparent} from 'utils/colour';
import {Config} from 'config';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

class Tile {
    constructor(canvas, x, y, width, height, transparentBackground) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.transparentBackground = transparentBackground;
        this.greyScale = null;
    }

    get background() {
        return this;
    }

    get foreground() {
        return this;
    }
}

class LayeredTile extends Tile {
    constructor(canvas, x, y, width, height, transparentBackground, background, foreground) {
        super(canvas, x, y, width, height, transparentBackground);
        this._background = background;
        this._foreground = foreground;
    }

    get background() {
        return this._background;
    }

    get foreground() {
        return this._foreground;
    }
}

export class TileStore {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.canvas = this.createMemoryCanvas();
        this.ctx = this.canvas.getContext('2d');

        if (Config.DEBUG) {
            $('#canvas').after(this.canvas);
            this.canvas.style.backgroundColor = 'pink';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '800px';
            this.canvas.style.left = '0px';
        }

        this.tempCanvas = this.createMemoryCanvas();
        this.tempCtx = this.tempCanvas.getContext('2d');

        this.setFont('IBM-BIOS', 16);
        this.textXOffset = 2;
        this.textYOffset = -1;

        this.column = 0;
        this.row = 0;

        this.xOffset = 0;
        this.yOffset = 0;

        this.maxColumns = 40;
    }
    createMemoryCanvas() {
        let canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        return canvas;
    }

    getFontString() {
        let str = '';
        if (this.fontItalic) {
            str += 'italic ';
        }
        if (this.fontBold) {
            str += 'bold ';
        }
        str += `${this.fontHeight}px ${this.fontFace}`;
        return str;
    }

    setFont(fontFace, fontHeight, fontBold = false, fontItalic = false) {
        this.fontFace = fontFace;
        this.fontHeight = fontHeight;
        this.fontBold = fontBold;
        this.fontItalic = fontItalic;
        this.updateFont();
    }

    updateFont() {
        /* Calculate the font width */
        this.ctx.font = this.getFontString();
        this.tempCtx.font = this.getFontString();
        this.fontWidth = Math.ceil(this.ctx.measureText('@').width);

        this.centreXOffset = (this.width - this.fontWidth)/2;
        this.centreYOffset = (this.height - this.fontHeight)/1.5;
    }

    getNextOffset() {
        if (this.column == this.maxColumns) {
            this.column = 0;
            ++this.row;
        }
        this.xOffset = this.column * this.width;
        this.yOffset = this.row * this.height;
        ++this.column;
    }

    clearTempCanvas() {
        this.tempCtx.beginPath();
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
        this.tempCtx.fill();
    }

    allocateTile(x, y, width, height, transparentBackground) {
        let tile = new Tile(this.canvas, this.xOffset, this.yOffset,
                        this.width, this.height, transparentBackground);
        tile.greyScale = this.allocateGreyScaleTile(tile);
        return tile;
    }

    allocateLayeredTile(x, y, width, height, transparentBackground, background, foreground) {
        let tile = new LayeredTile(this.canvas, this.xOffset, this.yOffset,
                               this.width, this.height, false, background, foreground);
        tile.greyScale = this.allocateGreyScaleTile(tile);
        return tile;
    }

    drawTile(tile, x, y) {
        this.ctx.drawImage(
            this.canvas,
            tile.x, tile.y,
            tile.width, tile.height,
            x, y,
            tile.width, tile.height
        );
    }

    allocateFromTiles(background, foreground) {
        this.getNextOffset();
        this.drawTile(background, this.xOffset, this.yOffset);
        this.drawTile(foreground, this.xOffset, this.yOffset);
        return this.allocateLayeredTile(this.xOffset, this.yOffset,
                                this.width, this.height, false, background, foreground);
    }

    allocateGreyScaleTile(tile) {
        this.getNextOffset();
        let imageData = this.ctx.getImageData(tile.x, tile.y, tile.width, tile.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let total = data[i] + data[i+1] + data[i+2];
            let average = total / 3;
            // darken the result
            average *= 0.75;
            data[i] = average;
            data[i+1] = average;
            data[i+2] = average;
        }
        this.ctx.putImageData(imageData, this.xOffset, this.yOffset);
        return new Tile(this.canvas, this.xOffset, this.yOffset,
                        this.width, this.height, tile.transparentBackground);
    }

    allocateCharacterTile(character, foreColour = '#ffffff', backColour = Transparent) {

        let background, foreground;
        let transparent = backColour === Transparent;

        if (!transparent) {
            this.getNextOffset();

            this.ctx.beginPath();
            this.ctx.fillStyle = backColour;
            this.ctx.fillRect(this.xOffset, this.yOffset, this.width, this.height);
            this.ctx.fill();
            background = this.allocateTile(this.xOffset, this.yOffset,
                                    this.width, this.height, backColour === Transparent);
        }

        this.getNextOffset();

        this.clearTempCanvas();
        this.tempCtx.beginPath();
        this.tempCtx.fillStyle = foreColour;
        this.tempCtx.fillText(
            character,
            this.centreXOffset + this.textXOffset,
            this.height - this.centreYOffset + this.textYOffset
        );
        this.tempCtx.fill();

        this.ctx.drawImage(this.tempCanvas, 0, 0, this.width, this.height,
                this.xOffset, this.yOffset, this.width, this.height);

        foreground = this.allocateTile(this.xOffset, this.yOffset,
                                this.width, this.height, backColour === Transparent);

        let tile;
        if (transparent) {
            tile = foreground;
        } else {
            tile = this.allocateFromTiles(background, foreground);
        }
        tile._ = `character(${character}, ${foreColour}, ${backColour})`;
        return tile;
    }

    allocateImageTile(image, transparentBackground = false) {
        this.getNextOffset();

        /* Draw the image to a temporary canvas */
        this.clearTempCanvas();
        this.tempCtx.drawImage(image, 0, 0);

        let fromImageData = this.tempCtx.getImageData(0, 0, image.width, image.height);
        let toImageData = this.ctx.getImageData(this.xOffset, this.yOffset, this.width, this.height);

        let xScale = image.width / this.width;
        let yScale = image.height / this.height;

        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                let toI = (y * this.width + x) * 4;
                let fromI = (Math.floor(y * yScale) * image.width + Math.floor(x * xScale)) * 4;

                toImageData.data[toI] = fromImageData.data[fromI];
                toImageData.data[toI+1] = fromImageData.data[fromI+1];
                toImageData.data[toI+2] = fromImageData.data[fromI+2];
                toImageData.data[toI+3] = fromImageData.data[fromI+3];
            }
        }

        this.ctx.putImageData(toImageData, this.xOffset, this.yOffset);

        let tile = this.allocateTile(this.xOffset, this.yOffset, this.width, this.height, transparentBackground);
        tile._ = `image(${image.src})`;
        return tile;
    }

    allocateDotTile(size, foreColour, backColour) {
        this.getNextOffset();
        this.ctx.beginPath();
        this.ctx.fillStyle = backColour;
        this.ctx.fillRect(this.xOffset, this.yOffset, this.width, this.height);
        this.ctx.fill();
        let background = this.allocateTile(this.xOffset, this.yOffset, this.width, this.height, false);

        this.getNextOffset();
        this.ctx.beginPath();
        this.ctx.fillStyle = foreColour;
        this.ctx.fillRect(this.xOffset + ((this.width - size) / 2),
                          this.yOffset + ((this.height - size) / 2), size, size);
        this.ctx.fill();
        let foreground = this.allocateTile(this.xOffset, this.yOffset, this.width, this.height, true);

        let tile = this.allocateFromTiles(background, foreground);
        tile._ = `dot(${foreColour}, ${backColour})`;
        return tile;
    }

    allocateSquareTile(colour) {
        this.getNextOffset();
        this.ctx.beginPath();
        this.ctx.fillStyle = colour;
        this.ctx.fillRect(this.xOffset, this.yOffset, this.width, this.height);
        this.ctx.fill();
        return this.allocateTile(this.xOffset, this.yOffset, this.width, this.height, false);
    }
}
