export function loadImagePromise(src) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = () => { resolve(image) };
        image.onerror = reject;
        image.src = src;
    });
}

export async function loadImage(src) {
    var ret;
    await loadImagePromise(src).then((image) => {
        ret = image;
    });
    return ret;
}
