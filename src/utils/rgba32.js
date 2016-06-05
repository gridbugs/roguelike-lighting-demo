import {rgbaString} from 'utils/rgb_string';
import {mask} from 'utils/bit';

const RGB_MASK = mask(24);
const ALPHA_MASK = ~RGB_MASK;
const RED_SHIFT = 0;
const GREEN_SHIFT = 8;
const BLUE_SHIFT = 16;
const ALPHA_SHIFT = 24;

export const TRANSPARENT = 0;

export function rgba32(r, g, b, a) {
    return (a << ALPHA_SHIFT) | (b << BLUE_SHIFT) | (g << GREEN_SHIFT) | (r << RED_SHIFT);
}

export function rgba32FloatAlpha(r, g, b, a) {
    return rgba32(r, g, b, Math.floor(a * 255));
}

export function rgba32Red(colour) {
    return (colour >> RED_SHIFT) & 0xff;
}

export function rgba32Green(colour) {
    return (colour >> GREEN_SHIFT) & 0xff;
}

export function rgba32Blue(colour) {
    return (colour >> BLUE_SHIFT) & 0xff;
}

export function rgba32Alpha(colour) {
    return (colour >> ALPHA_SHIFT) & 0xff;
}

export function rgba32ToString(colour) {
    return rgbaString(rgba32Red(colour),
                      rgba32Green(colour),
                      rgba32Blue(colour),
                      rgba32Alpha(colour) / 255);
}

export function rgba32Add(x, y) {
    let r = Math.min(rgba32Red(x) + rgba32Red(y), 0xff);
    let g = Math.min(rgba32Green(x) + rgba32Green(y), 0xff);
    let b = Math.min(rgba32Blue(x) + rgba32Blue(y), 0xff);
    let a = Math.min(rgba32Alpha(x) + rgba32Alpha(y), 0xff);
    return rgba32(r, g, b, a);
}

export function rgba32Lighten(colour, change) {
    let r = Math.min(rgba32Red(colour) + change, 0xff);
    let g = Math.min(rgba32Green(colour) + change, 0xff);
    let b = Math.min(rgba32Blue(colour) + change, 0xff);
    let a = rgba32Alpha(colour);
    return rgba32(r, g, b, a);
}

export function rgba32Darken(colour, change) {
    let r = Math.max(rgba32Red(colour) - change, 0);
    let g = Math.max(rgba32Green(colour) - change, 0);
    let b = Math.max(rgba32Blue(colour) - change, 0);
    let a = rgba32Alpha(colour);
    return rgba32(r, g, b, a);
}

export function rgba32DarkenRatio(colour, ratio) {
    let r = Math.floor(rgba32Red(colour) * ratio);
    let g = Math.floor(rgba32Green(colour) * ratio);
    let b = Math.floor(rgba32Blue(colour) * ratio);
    let a = rgba32Alpha(colour);
    return rgba32(r, g, b, a);
}

export function rgba32Opacify(colour, change) {
    let alpha = Math.min(rgba32Alpha(colour) + change, 0xff);
    return (alpha << ALPHA_SHIFT) | (colour & RGB_MASK);
}

export function rgba32OpacityFloat(colour, change) {
    return rgba32Opacify(colour, change * 255);
}

export function rgba32Transparentise(colour, change) {
    let alpha = Math.max(rgba32Alpha(colour) - change, 0);
    return (alpha << ALPHA_SHIFT) | (colour & RGB_MASK);
}

export function rgba32TransparentiseFloat(colour, change) {
    return rgba32Transparentise(colour, change * 255);
}

export function rgba32TransparentiseRatio(colour, ratio) {
    let alpha = Math.floor(rgba32Alpha(colour) * ratio);
    return (alpha << ALPHA_SHIFT) | (colour & RGB_MASK);
}

export function rgba32IsTransparent(colour) {
    return !(colour & ALPHA_MASK);
}
