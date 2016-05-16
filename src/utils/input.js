import {makeEnum} from 'utils/enum';

/* Modifier Key Codes */
export const KEYCODE_SHIFT      = 16;
export const KEYCODE_CONTROL    = 17;
export const KEYCODE_ALT        = 18;
export const KEYCODE_ESCAPE     = 27;
export const KEYCODE_ENTER      = 13;

export const NonChar = makeEnum([
    'LEFT_ARROW',
    'RIGHT_ARROW',
    'UP_ARROW',
    'DOWN_ARROW',
    'HOME',
    'PAGE_UP',
    'PAGE_DOWN',
    'END',
    'NUMPAD_5'
], true);

const nonCharTable = new Array(256);
nonCharTable[12] = NonChar.NUMPAD_5;
nonCharTable[33] = NonChar.PAGE_UP;
nonCharTable[34] = NonChar.PAGE_DOWN;
nonCharTable[35] = NonChar.END;
nonCharTable[36] = NonChar.HOME;
nonCharTable[37] = NonChar.LEFT_ARROW;
nonCharTable[38] = NonChar.UP_ARROW;
nonCharTable[39] = NonChar.RIGHT_ARROW;
nonCharTable[40] = NonChar.DOWN_ARROW;

const KEYCODE_A          = 65;
const KEYCODE_Z          = KEYCODE_A + 25;
const KEYCODE_0          = 48;
const KEYCODE_9          = KEYCODE_0 + 9;

/* Character Table for Non Alpha Characters */
const charTable = new Array(256);
const shiftCharTable = new Array(256);

charTable[188] = ',';
charTable[190] = '.';
charTable[191] = '/';

shiftCharTable[188] = '<';
shiftCharTable[190] = '>';
shiftCharTable[191] = '?';

export async function getKey() {
    var ret;
    await new Promise((resolve) => {
        $(window).keydown((e) => {
            ret = e;
            resolve();
        });
    });

    return ret;
}

export async function getKeyCode() {
    var key = await getKey();
    return key.keyCode;
}

export async function getNonModifierKey() {
    var key;
    while (true) {
        key = await getKey();
        var code = key.keyCode;

        if (!(code == KEYCODE_SHIFT || code == KEYCODE_CONTROL || code == KEYCODE_ALT)) {
            break;
        }
    }
    return key;
}

export function keyIsAlpha(key) {
    return key.keyCode >= KEYCODE_A && key.keyCode <= KEYCODE_Z;
}

export function keyIsDigit(key) {
    return key.keyCode >= KEYCODE_0 && key.keyCode <= KEYCODE_9;
}

export function keyIsSymbol(key) {
    return charTable[key.keyCode] != undefined;
}

export function getCharFromKey(key) {
    var character = null;
    if (keyIsAlpha(key)) {
        character = String.fromCharCode(key.keyCode);
        if (!key.shiftKey) {
            character = character.toLowerCase();
        }
    } else if (keyIsDigit(key)) {
        if (key.shiftKey) {
            // TODO
        } else {
            character = String.fromCharCode(key.keyCode);
        }
    } else if (keyIsSymbol(key)) {
        if (key.shiftKey) {
            character = shiftCharTable[key.keyCode];
        } else {
            character = charTable[key.keyCode];
        }
    }
    return character;
}

export function keyIsChar(key) {
    return keyIsAlpha(key) || keyIsDigit(key) || keyIsSymbol(key);
}

export function keyIsNonChar(key) {
    return nonCharTable[key.keyCode] != undefined;
}

export async function getChar() {
    var key = await getNonModifierKey();
    return getCharFromKey(key);
}

export function getNonCharFromKey(key) {
    if (keyIsNonChar(key)) {
        return nonCharTable[key.keyCode];
    }
    return null;
}

export async function getNonChar() {
    var key = await getNonModifierKey();
    return getNonCharFromKey(key);
}
