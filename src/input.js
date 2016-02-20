export const KEYCODE_SHIFT      = 16;
export const KEYCODE_CONTROL    = 17;
export const KEYCODE_ALT        = 18;
export const KEYCODE_ESCAPE     = 27;
export const KEYCODE_ENTER      = 13;

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

export function getCharFromKey(key) {
    var character = String.fromCharCode(key.keyCode);
    if (!key.shiftKey) {
        character = character.toLowerCase();
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
