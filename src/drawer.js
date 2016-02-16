export class Drawer {
    constructor(canvas, tileWidth, tileHeight) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    clear() {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
    }

    drawTile(tile, x, y) {
        this.ctx.drawImage(
            tile.canvas,
            tile.x, tile.y,
            tile.width, tile.height,
            x * this.tileWidth, y * this.tileHeight,
            tile.width, tile.height
        );
    }
}
