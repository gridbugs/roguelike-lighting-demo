import {Config} from 'config';
import {Sprite} from 'utils/sprite';
import {StringColours} from 'utils/colour';
import {Effect} from 'effect';
import {TileFamily, ComplexTileFamily} from 'tiles/tile_family';
import {createCanvasContext} from 'utils/canvas';

const STAGE_WIDTH = 128;
const STAGE_HEIGHT = 128;

export class TileStore {
    constructor(tileWidth, tileHeight, width, height) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.width = width;
        this.height = height;

        this.ctx = createCanvasContext(this.width, this.height);
        this.canvas = this.ctx.canvas;

        this.stageCtx = createCanvasContext(STAGE_WIDTH, STAGE_HEIGHT);
        this.stageCanvas = this.stageCtx.canvas;

        if (Config.DEBUG) {
            $('#canvas').after(this.canvas);
            this.canvas.style.backgroundColor = 'pink';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '800px';
            this.canvas.style.left = '0px';
        }

        this.nextColumn = 0;
        this.nextRow = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.maxColumns = Math.floor(width / tileWidth);
    }

    clearStage() {
        this.stageCtx.clearRect(0, 0, this.stageCanvas.width, this.stageCanvas.height);
    }

    newLine() {
        this.nextColumn = 0;
        this.nextRow++;
    }

    getNextOffset() {
        if (this.nextColumn == this.maxColumns) {
            this.newLine();
        }
        this.xOffset = this.nextColumn * this.tileWidth;
        this.yOffset = this.nextRow * this.tileHeight;
        this.nextColumn++;
    }

    createSprite(debug = '') {
        return new Sprite(this.ctx, this.xOffset, this.yOffset, this.tileWidth, this.tileHeight, debug);
    }

    getSpriteImageData(sprite) {
        return sprite.ctx.getImageData(sprite.x, sprite.y,
                                                 sprite.width, sprite.height);
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

        return this.createSprite(`character(${character}, ${colour}, ${font.name}, ${font.size})`);
    }

    createDotSprite(size, colour) {
        this.getNextOffset();

        this.ctx.beginPath();
        this.ctx.fillStyle = colour;

        let x = this.xOffset + (this.tileWidth / 2) - (size / 2);
        let y = this.yOffset + (this.tileHeight / 2) - (size / 2);
        this.ctx.fillRect(x, y, size, size);
        this.ctx.fill();

        return this.createSprite(`dot(${size}, ${colour})`);
    }

    createImageSprite(image) {
        this.getNextOffset();

        this.clearStage();

        this.stageCtx.drawImage(image, 0, 0);

        let fromImageData = this.stageCtx.getImageData(0, 0, image.width, image.height);
        let toImageData = this.ctx.getImageData(this.xOffset, this.yOffset, this.tileWidth, this.tileHeight);

        let xScale = image.width / this.tileWidth;
        let yScale = image.height / this.tileHeight;

        for (let y = 0; y < this.tileHeight; y++) {
            for (let x = 0; x < this.tileWidth; x++) {
                let toI = (y * this.tileWidth + x) * 4;
                let fromI = (Math.floor(y * yScale) * image.width + Math.floor(x * xScale)) * 4;

                toImageData.data[toI] = fromImageData.data[fromI];
                toImageData.data[toI+1] = fromImageData.data[fromI+1];
                toImageData.data[toI+2] = fromImageData.data[fromI+2];
                toImageData.data[toI+3] = fromImageData.data[fromI+3];
            }
        }

        this.ctx.putImageData(toImageData, this.xOffset, this.yOffset);

        return this.createSprite(`image(${image.src})`);
    }

    createSolidSprite(colour) {
        this.getNextOffset();

        this.ctx.beginPath();
        this.ctx.fillStyle = colour;
        this.ctx.fillRect(this.xOffset, this.yOffset, this.tileWidth, this.tileHeight);
        this.ctx.fill();

        return this.createSprite(`solid(${colour})`);
    }

    createLayeredSprite(foregroundSprite, backgroundSprite) {
        this.getNextOffset();

        this.ctx.drawImage(
            backgroundSprite.canvas,
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
            foregroundSprite.canvas,
            foregroundSprite.x,
            foregroundSprite.y,
            foregroundSprite.width,
            foregroundSprite.height,
            this.xOffset,
            this.yOffset,
            this.tileWidth,
            this.tileHeight
        );

        return this.createSprite(`layered(${foregroundSprite.debug}, ${backgroundSprite.debug})`);
    }

    createGreyscaleSprite(sprite) {
        this.getNextOffset();

        let imageData = this.getSpriteImageData(sprite);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let total = data[i] + data[i+1] + data[i+2];
            let average = total / 3;
            /* darken the greyscale tiles */
            average *= 0.5;
            data[i] = average;
            data[i+1] = average;
            data[i+2] = average;
        }

        this.ctx.putImageData(imageData, this.xOffset, this.yOffset);

        return this.createSprite(`greyscale(${sprite.debug})`);
    }

    createLightLevelSprite(sprite, litRatio, litOffset) {
        this.getNextOffset();

        let imageData = this.getSpriteImageData(sprite);
        let data = imageData.data;

        for (let i = 0; i < data.length; i+= 4) {
            data[i] = Math.floor(Math.max(Math.min(data[i] * litRatio + litOffset, 255), 0));
            data[i+1] = Math.floor(Math.max(Math.min(data[i+1] * litRatio + litOffset, 255), 0));
            data[i+2] = Math.floor(Math.max(Math.min(data[i+2] * litRatio + litOffset, 255), 0));
        }

        this.ctx.putImageData(imageData, this.xOffset, this.yOffset);

        return this.createSprite(`lightLevel(${sprite.debug}, ${litRatio}, ${litOffset})`);
    }

    createTransparentSprite(sprite, alpha) {
        this.getNextOffset();

        let imageData = this.getSpriteImageData(sprite);
        let data = imageData.data;

        for (let i = 0; i < data.length; i+= 4) {
            data[i+3] = data[i+3] * alpha;
        }

        this.ctx.putImageData(imageData, this.xOffset, this.yOffset);

        return this.createSprite(`transparent(${sprite.debug}, ${alpha})`);
    }

    createCharacterTile(character, font, colour, backgroundColour, transparent, effects) {
        let foregroundSprite = this.createCharacterSprite(character, font, colour);

        if (backgroundColour == StringColours.Transparent) {
            return new TileFamily(foregroundSprite, this, transparent, effects);
        } else {
            let backgroundSprite = this.createSolidSprite(backgroundColour);
            return new ComplexTileFamily(foregroundSprite, backgroundSprite, this, transparent, effects);
        }
    }

    createSolidTile(colour, transparent, effects) {
        let sprite = this.createSolidSprite(colour);
        return new TileFamily(sprite, this, transparent, effects);
    }

    createDotTile(size, foregroundColour, backgroundColour, transparent, effects) {
        let foregroundSprite = this.createDotSprite(size, foregroundColour);

        if (backgroundColour == StringColours.Transparent) {
            return new TileFamily(foregroundSprite, this, transparent, effects);
        } else {
            let backgroundSprite = this.createSolidSprite(backgroundColour);
            return new ComplexTileFamily(foregroundSprite, backgroundSprite, this, transparent, effects);
        }
    }

    createImageTile(image, transparent, effects) {
        let sprite = this.createImageSprite(image);
        return new TileFamily(sprite, this, transparent, effects);
    }
}
