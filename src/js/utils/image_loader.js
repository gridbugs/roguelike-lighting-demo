export function loadImage(src) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = () => { resolve(image) };
        image.onerror = reject;
        image.src = src;
    });
}
