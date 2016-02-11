export class Drawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
    }

    drawTile(tile, x, y) {
        this.ctx.drawImage(tile.canvas, tile.x, tile.y, tile.width, tile.height, x, y, tile.width, tile.height);
    }
}
