class Tile {
    constructor(canvas, x, y, width, height) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

    allocateCharacterTile(character, foreColour = '#ffffff', backColour = '#000000') {
        let xOffset = this.count * this.width;
        ++this.count;

        this.ctx.beginPath();
        this.ctx.fillStyle = backColour;
        this.ctx.fillRect(xOffset, 0, this.width, this.height);
        this.ctx.fillStyle = foreColour;
        this.ctx.fillText(
            character,
            xOffset + this.centreXOffset + this.xOffset,
            this.height - this.centreYOffset + this.yOffset
        );
        this.ctx.fill();

        return new Tile(this.canvas, xOffset, 0, this.width, this.height);
    }

    allocateImage(image) {
        let xOffset = this.count * this.width;
        ++this.count;

        this.ctx.beginPath();
        this.ctx.drawImage(image, xOffset, 0, this.width, this.height);

        return new Tile(this.canvas, xOffset, 0, this.width, this.height);
    }
}
