export class Sprite {
    constructor(ctx, x, y, width, height, debug = '') {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.debug = debug;
    }

    drawSprite(sprite) {
        this.ctx.drawImage(
                sprite.canvas,
                sprite.x, sprite.y,
                sprite.width, sprite.height,
                this.x, this.y,
                this.width, this.height);
    }

    clear() {
        this.ctx.clearRect(this.x, this.y, this.width, this.height);
    }
}
