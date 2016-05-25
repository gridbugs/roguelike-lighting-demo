import {Effect} from 'effect';
import {Colour} from 'colour';

const defaultEffects = new Set([Effect.Greyscale, Effect.LightLevels]);
const emptySet = new Set();

export const CharacterTile = NAMED_TUPLE(
    character,
    font,
    foregroundColour,
    backgroundColour = Colour.Transparent,
    transparent = backgroundColour == Colour.Transparent,
    effects = defaultEffects,
    type = 'character'
);

export const SolidTile = NAMED_TUPLE(
    colour,
    transparent = false,
    effects = emptySet,
    type = 'solid'
);

export const DotTile = NAMED_TUPLE(
    size,
    foregroundColour,
    backgroundColour = Colour.Transparent,
    transparent = backgroundColour == Colour.Transparent,
    effects = defaultEffects,
    type = 'dot'
);
