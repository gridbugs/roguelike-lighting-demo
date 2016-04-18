import {MAX_OPACITY} from 'opacity';

export function detectVisibleArea(eyePosition, viewDistance, grid, visionCells) {
    for (let cell of grid) {
        visionCells.add(cell, MAX_OPACITY);
    }
}
