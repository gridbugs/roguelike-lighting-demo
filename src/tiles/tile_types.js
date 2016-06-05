import {Effect} from 'effect';
import {Strings} from 'utils/colour';

const defaultEffects = new Set([Effect.Greyscale, Effect.LightLevels]);
const emptySet = new Set();

export const CharacterTile = NAMED_TUPLE(
    character,
    font,
    foregroundColour,
    backgroundColour = Strings.Transparent,
    transparent = backgroundColour == Strings.Transparent,
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
    backgroundColour = Strings.Transparent,
    transparent = backgroundColour == Strings.Transparent,
    effects = defaultEffects,
    type = 'dot'
);

export const ImageTile = NAMED_TUPLE(
    path,
    transparent,
    effects = defaultEffects,
    type = 'image'
);
