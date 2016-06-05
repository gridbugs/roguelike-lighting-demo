import {Effect} from 'effect';
import {StringColours} from 'utils/colour';

const defaultEffects = new Set([Effect.Greyscale, Effect.LightLevels]);
const emptySet = new Set();

export const CharacterTile = NAMED_TUPLE(
    character,
    font,
    foregroundColour,
    backgroundColour = StringColours.Transparent,
    transparent = backgroundColour == StringColours.Transparent,
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
    backgroundColour = StringColours.Transparent,
    transparent = backgroundColour == StringColours.Transparent,
    effects = defaultEffects,
    type = 'dot'
);

export const ImageTile = NAMED_TUPLE(
    path,
    transparent,
    effects = defaultEffects,
    type = 'image'
);
