export function createCanvasContext(width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas.getContext('2d');
}

export function getCanvasContextById(id) {
    let canvas = document.getElementById(id);
    return canvas.getContext('2d');
}
