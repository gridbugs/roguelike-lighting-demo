export function detectVisibleArea(eyePosition, viewDistance, grid, visionCells) {
    for (let cell of grid) {
        visionCells.addAllSides(cell, 1);
    }
}
