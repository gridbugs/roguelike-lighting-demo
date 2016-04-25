import {Config} from 'config';
import {Sprite} from 'tiles/sprite';
import {Colour} from 'colour';
import {TileFamily, ComplexTileFamily} from 'tiles/tile_family';

export class TileStore {
    constructor(tileWidth, tileHeight, width, height) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.width = width;
        this.height = height;

        this.ctx = this.createMemoryCanvas(this.width, this.height);
        this.canvas = this.ctx.canvas;

        this.stageCtx = this.createMemoryCanvas(tileWidth, tileHeight);

        if (Config.DEBUG) {
            $('#canvas').after(this.canvas);
            this.canvas.style.backgroundColor = 'pink';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0px';
            this.canvas.style.left = '0px';
        }

        this.nextColumn = 0;
        this.nextRow = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.maxColumns = Math.floor(width / tileWidth);
    }

    newLine() {
        this.nextColumn = 0;
        ++this.nextRow;
    }

    getNextOffset() {
        if (this.nextColumn === this.maxColumns) {
            this.newLine();
        }
        this.xOffset = this.nextColumn * this.tileWidth;
        this.yOffset = this.nextRow * this.tileHeight;
        ++this.nextColumn;
    }

    createSprite() {
        return new Sprite(this, this.xOffset, this.yOffset, this.tileWidth, this.tileHeight);
    }

    createMemoryCanvas(width, height) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext('2d');
    }

    setFont(font) {
        let boldStr = font.bold ? "bold" : "";
        let italicStr = font.italic ? "italic" : "";
        this.ctx.font = `${boldStr} ${italicStr} ${font.size}px ${font.name}`;
    }

    createCharacterSprite(character, font, colour) {
        this.getNextOffset();

        this.setFont(font);
        this.ctx.beginPath();
        this.ctx.fillStyle = colour;

        let x = this.xOffset + font.xOffset;
        let y = this.yOffset + font.yOffset + this.tileHeight;
        this.ctx.fillText(character, x, y);
        this.ctx.fill();

        return this.createSprite();
    }

    createSolidSprite(colour) {
        this.getNextOffset();

        this.ctx.beginPath();
        this.ctx.fillStyle = colour;
        this.ctx.fillRect(this.xOffset, this.yOffset, this.tileWidth, this.tileHeight);
        this.ctx.fill();

        return this.createSprite();
    }

    createLayeredSprite(foregroundSprite, backgroundSprite) {
        this.getNextOffset();

        this.ctx.drawImage(
            backgroundSprite.tileStore.canvas,
            backgroundSprite.x,
            backgroundSprite.y,
            backgroundSprite.width,
            backgroundSprite.height,
            this.xOffset,
            this.yOffset,
            this.tileWidth,
            this.tileHeight
        );

        this.ctx.drawImage(
            foregroundSprite.tileStore.canvas,
            foregroundSprite.x,
            foregroundSprite.y,
            foregroundSprite.width,
            foregroundSprite.height,
            this.xOffset,
            this.yOffset,
            this.tileWidth,
            this.tileHeight
        );

        return this.createSprite();
    }

    createGreyScaleSprite(sprite) {
        this.getNextOffset();
        let imageData = sprite.tileStore.ctx.getImageData(sprite.x, sprite.y,
                                                          sprite.width, sprite.height);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let total = data[i] + data[i+1] + data[i+2];
            let average = total / 3;
            data[i] = average;
            data[i+1] = average;
            data[i+2] = average;

            // keep the alpha channel unchanged
            data[i+3] = data[i+3];
        }

        this.ctx.putImageData(imageData, this.xOffset, this.yOffset);

        return this.createSprite();
    }

    createCharacterTile(character, font, colour, backgroundColour, transparent) {
        let foregroundSprite = this.createCharacterSprite(character, font, colour);

        if (backgroundColour === Colour.Transparent) {
            return new TileFamily(foregroundSprite, transparent);
        } else {
            let backgroundSprite = this.createSolidSprite(backgroundColour);
            return new ComplexTileFamily(foregroundSprite, backgroundSprite, transparent);
        }
    }

    createSolidTile(colour, transparent) {
        let sprite = this.createSolidSprite(colour);
        return new TileFamily(sprite, transparent);
    }
}
