const KEYCODE_SHIFT = 16;
const KEYCODE_CONTROL = 17;
const KEYCODE_ALT = 18;

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

export async function getChar() {
    var key;
    var code;
    while (true) {
        key = await getKey();
        code = key.keyCode;

        if (!(code == KEYCODE_SHIFT || code == KEYCODE_CONTROL || code == KEYCODE_ALT)) {
            break;
        }
    }
    var character = String.fromCharCode(code);
    if (!key.shiftKey) {
        character = character.toLowerCase();
    }
    return character;
}
