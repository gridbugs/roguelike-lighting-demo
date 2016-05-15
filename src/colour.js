export function rgb(r, g, b) {
    return `rgb(${r},${g},${b})`;
}

export function rgba(r, g, b, a) {
    return `rgb(${r},${g},${b})`;
}

export const Colour = {
    Black: rgb(0, 0, 0),
    White: rgb(255, 255, 255),
    Transparent: rgba(0, 0, 0, 0)
}
