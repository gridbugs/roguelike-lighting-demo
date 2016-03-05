/* Modifier Key Codes */
export const KEYCODE_SHIFT      = 16;
export const KEYCODE_CONTROL    = 17;
export const KEYCODE_ALT        = 18;
export const KEYCODE_ESCAPE     = 27;
export const KEYCODE_ENTER      = 13;

export const KEYCODE_A          = 65;
export const KEYCODE_Z          = KEYCODE_A + 25;
export const KEYCODE_0          = 48;
export const KEYCODE_9          = KEYCODE_0 + 9;

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

        if (!(code === KEYCODE_SHIFT || code === KEYCODE_CONTROL || code === KEYCODE_ALT)) {
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

export function getCharFromKey(key) {
    var character;
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
    } else {
        if (key.shiftKey) {
            character = shiftCharTable[key.keyCode];
        } else {
            character = charTable[key.keyCode];
        }
    }
    return character;
}

export function isCharKey(key) {
    return String.fromCharCode(key.keyCode) !== "";
}

export async function getChar() {
    var key = await getNonModifierKey();
    return getCharFromKey(key);
}
