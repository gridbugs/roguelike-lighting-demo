export function detectVisibleArea(eyePosition, viewDistance, grid, visionCells) {
    for (let cell of grid) {
        visionCells.add(cell, 1);
    }
}
