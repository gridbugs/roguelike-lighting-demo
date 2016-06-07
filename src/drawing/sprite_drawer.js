import {DrawerGrid, DrawerCell} from 'drawing/drawer_grid';

class SpriteDrawerCell extends DrawerCell {
    constructor(x, y, grid, ctx, tileWidth, tileHeight) {
        super(x, y, grid, ctx, tileWidth, tileHeight);
        this.lastDrawnSprite = null;
    }

    drawSprite(sprite) {
        if (sprite != this.lastDrawnSprite) {
            this.sprite.drawSprite(sprite);
            this.lastDrawnSprite = sprite;
        }
    }

    clear() {
        if (this.lastDrawnSprite != null) {
            this.sprite.clear();
            this.lastDrawnSprite = null;
        }
    }
}

export class SpriteDrawer extends DrawerGrid(SpriteDrawerCell) {}
