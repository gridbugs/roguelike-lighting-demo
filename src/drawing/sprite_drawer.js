import {DrawerGrid, DrawerCell} from 'drawing/drawer_grid';

class SpriteDrawerCell extends DrawerCell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.lastDrawnSprite = null;
    }

    drawSprite(sprite) {
        if (sprite != this.lastDrawnSprite) {
            this.sprite.drawSprite(sprite);
            this.lastDrawnSprite = sprite;
        }
    }
}

export class SpriteDrawer extends DrawerGrid(SpriteDrawerCell) {}
