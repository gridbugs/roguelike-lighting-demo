import {makeEnum} from 'utils/enum';
import {Effect} from 'effect';

const NUM_LIGHT_LEVELS = 32;
const NUM_TRANSPARENCY_LEVELS = 32;

const defaultEffects = new Set([Effect.Greyscale, Effect.LightLevels]);

export class TileFamily {
    constructor(sprite, tileStore, transparent, effects = defaultEffects) {

        this.main = sprite;
        this.tileStore = tileStore;
        this.transparent = transparent;

        if (effects.has(Effect.Greyscale)) {
            this.greyScale = this.tileStore.createGreyscaleSprite(this.main);
        } else {
            this.greyScale = null;
        }

        if (effects.has(Effect.LightLevels)) {
            this.lightLevels = new Array(NUM_LIGHT_LEVELS);
            for (let i = 0; i < NUM_LIGHT_LEVELS; ++i) {
                let litRatio = i * 2 / NUM_LIGHT_LEVELS;
                let litOffset = 0;
                this.lightLevels[i] = this.tileStore.createLightLevelSprite(
                    this.main,
                    litRatio,
                    litOffset
                );
            }
        } else {
            this.lightLevels = null;
        }

        if (effects.has(Effect.TransparencyLevels)) {
            this.transparencyLevels = new Array(NUM_TRANSPARENCY_LEVELS);
            for (let i = 0; i < NUM_TRANSPARENCY_LEVELS; ++i) {
                let alpha = i / NUM_TRANSPARENCY_LEVELS;
                this.transparencyLevels[i] = this.tileStore.createTransparentSprite(
                    this.main,
                    alpha
                );
            }
        } else {
            this.transparencyLevels = null;
        }
    }
}

export class ComplexTileFamily extends TileFamily {
    constructor(foregroundSprite, backgroundSprite, tileStore, transparent, effects = defaultEffects) {
        super(
            tileStore.createLayeredSprite(foregroundSprite, backgroundSprite),
            tileStore,
            transparent,
            effects
        );

        this.foreground = new TileFamily(foregroundSprite, tileStore, true, effects);
        this.background = new TileFamily(backgroundSprite, tileStore, transparent, effects);

        this.transparent = transparent;
    }
}
