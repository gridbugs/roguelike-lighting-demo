/* Returns an integer with the only the xth bit set */
export function bit(x) {
    return 1 << x;
}

/* Returns an integer with x least significant bits set */
export function mask(x) {
    return (1 << x) - 1;
}
