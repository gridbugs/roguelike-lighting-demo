import {Transparent} from './colour.js';

class Tile {
    constructor(canvas, x, y, width, height, transparentBackground) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.transparentBackground = transparentBackground;
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

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.setFont('Monospace', 16);

        this.count = 0;
        this.xOffset = 0;
        this.yOffset = 0;
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
        this.fontWidth = Math.ceil(this.ctx.measureText('@').width);

        this.centreXOffset = (this.width - this.fontWidth)/2;
        this.centreYOffset = (this.height - this.fontHeight)/1.5;
    }

    getNextOffset() {
        let xOffset = this.count * this.width;
        ++this.count;
        return xOffset;
    }

    allocateCharacterTile(character, foreColour = '#ffffff', backColour = Transparent) {

        let background, foreground;
        let xOffset;
        let transparent = backColour === Transparent;

        if (!transparent) {
            xOffset = this.getNextOffset();

            this.ctx.beginPath();
            this.ctx.fillStyle = backColour;
            this.ctx.fillRect(xOffset, 0, this.width, this.height);
            this.ctx.fill();
            background = new Tile(this.canvas, xOffset, 0, this.width, this.height, backColour === Transparent);
        }

        xOffset = this.getNextOffset();

        this.ctx.beginPath();
        this.ctx.fillStyle = foreColour;
        this.ctx.fillText(
            character,
            xOffset + this.centreXOffset + this.xOffset,
            this.height - this.centreYOffset + this.yOffset
        );
        this.ctx.fill();
        foreground = new Tile(this.canvas, xOffset, 0, this.width, this.height, backColour === Transparent);

        if (transparent) {
            return foreground;
        } else {
            return this.allocateFromTiles(background, foreground);
        }
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
        let xOffset = this.getNextOffset();
        this.drawTile(background, xOffset, 0);
        this.drawTile(foreground, xOffset, 0);
        return new LayeredTile(this.canvas, xOffset, 0, this.width, this.height, false, background, foreground);
    }

    allocateImage(image, transparentBackground = false) {
        let xOffset = this.getNextOffset();

        this.ctx.drawImage(image, xOffset, 0, this.width, this.height);

        return new Tile(this.canvas, xOffset, 0, this.width, this.height, transparentBackground);
    }
}
