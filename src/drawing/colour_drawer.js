import {DrawerGrid, DrawerCell} from 'drawing/drawer_grid';
import {rgba32ToString, TRANSPARENT} from 'utils/rgba32';

class ColourDrawerCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.lastDrawnColourRgba32 = TRANSPARENT;
    }

    fillColour(colourRgba32) {
        if (colourRgba32 != this.lastDrawnColourRgba32) {
            let colourString = rgba32ToString(colourRgba32);
            this.sprite.fillColour(colourString);
            this.lastDrawnColourRgba32 = colourRgba32;
        }
    }
}

export class ColourDrawer extends DrawerGrid(ColourDrawerCell) {
    constructor(ctx, tileWidth, tileHeight) {
        super(ctx, tileWidth, tileHeight);
        ctx.globalCompositeOperation = 'copy';
    }
}
