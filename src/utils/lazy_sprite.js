import {SpriteAllocator} from 'utils/sprite_allocator';

/* To reduce the overhead of clearing sprites,
 * this class exposes a sprite interface, but
 * is represented by a large canvas that moves
 * the sprite around to blank areas until it
 * fills up, at which point it clears once and
 * starts again.
 */
export class LazySprite {
    constructor(tileWidth, tileHeight, numCols, numRows) {
        this.allocator = new SpriteAllocator(tileWidth, tileHeight, numCols, numRows);

        /* Fixed sprite fields */
        this.ctx = this.allocator.ctx;
        this.canvas = this.allocator.canvas;
        this.width = tileWidth;
        this.height = tileHeight;

        /* Dynamic sprite fields */
        this.x = 0;
        this.y = 0;
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
        if (this.allocator.full) {
            this.allocator.clear();
            this.allocator.flush();
        }

        this.allocator.getNextOffset();

        this.x = this.allocator.xOffset;
        this.y = this.allocator.yOffset;
    }
}
