import {MAX_OPACITY} from 'vision';

export function detectVisibleArea(eyePosition, viewDistance, grid, visionCells) {
    for (let cell of grid) {
        visionCells.add(cell, MAX_OPACITY);
    }
}
