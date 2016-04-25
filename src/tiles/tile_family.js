const NUM_LIGHT_LEVELS = 10;

export class TileFamily {
    constructor(sprite, transparent) {

        this.tileStore = sprite.tileStore;

        this.main = sprite;
        this.main.family = this;

        this.greyScale = this.tileStore.createGreyScaleSprite(this.main);

        this.lightLevels = new Array(NUM_LIGHT_LEVELS);
        for (let i = 0; i < NUM_LIGHT_LEVELS; ++i) {
//            this.lightLevels[i] = this.tileStore.createLightLevelSprite(this.main, i/NUM_LIGHT_LEVELS);
        }
    }
}

export class ComplexTileFamily extends TileFamily {
    constructor(foregroundSprite, backgroundSprite, transparent) {
        super(foregroundSprite.tileStore.createLayeredSprite(foregroundSprite, backgroundSprite));
        this.foreground = new TileFamily(foregroundSprite);
        this.background = new TileFamily(backgroundSprite);
    }
}
