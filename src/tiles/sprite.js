export class Sprite {
    constructor(tileStore, x, y, width, height, family = null) {
        this.tileStore = tileStore;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.family = family;
    }
}
