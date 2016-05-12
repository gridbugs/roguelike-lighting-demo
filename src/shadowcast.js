import {Vec2} from 'utils/vec2';
import {Direction} from 'utils/direction';
import {SQRT2, constrain} from 'utils/math';
import {ObjectStack} from 'utils/object_stack';

class StackFrame {
    constructor() {
        this.minSlope = 0;
        this.maxSlope = 0;
        this.depth = 0;
        this.visibility = 0;
    }
}

const COORD_IDX = new Vec2(0, 0);
const STACK = new ObjectStack(StackFrame, 64);

function computeSlope(fromVec, toVec, lateralIndex, depthIndex) {
    return  (toVec.arrayGet(lateralIndex) - fromVec.arrayGet(lateralIndex)) /
            (toVec.arrayGet(depthIndex) - fromVec.arrayGet(depthIndex));
}

export function detectVisibleArea(eyePosition, viewDistance, grid, visionCells) {
    let eyeCell = grid.get(eyePosition);
    let xMax = grid.width - 1;
    let yMax = grid.height - 1;
    let squareViewDistance = SQRT2 * viewDistance;
    let viewDistanceSquared = viewDistance * viewDistance;

    visionCells.addAllSides(eyeCell, 1);

    //  \|
    detectVisibleAreaOctant( eyeCell, viewDistance, grid, -1, 0,
                             Direction.NorthWest.subIndex, Direction.SouthWest.subIndex,
                             -1, Vec2.X_IDX, xMax, yMax, squareViewDistance, viewDistanceSquared,
                             visionCells, Direction.SouthEast.subIndex, Direction.South, Direction.East
    );

    //  |/
    detectVisibleAreaOctant( eyeCell, viewDistance, grid, 0, 1,
                             Direction.SouthWest.subIndex, Direction.NorthWest.subIndex,
                             -1, Vec2.X_IDX, xMax, yMax, squareViewDistance, viewDistanceSquared,
                             visionCells, Direction.SouthWest.subIndex, Direction.South, Direction.West
    );
    //  /|
    detectVisibleAreaOctant( eyeCell, viewDistance, grid, -1, 0,
                             Direction.SouthWest.subIndex, Direction.NorthWest.subIndex,
                             1, Vec2.X_IDX, xMax, yMax, squareViewDistance, viewDistanceSquared,
                             visionCells, Direction.NorthEast.subIndex, Direction.North, Direction.East
    );
    //  |\
    detectVisibleAreaOctant( eyeCell, viewDistance, grid, 0, 1,
                             Direction.NorthWest.subIndex, Direction.SouthWest.subIndex,
                             1, Vec2.X_IDX, xMax, yMax, squareViewDistance, viewDistanceSquared,
                             visionCells, Direction.NorthWest.subIndex, Direction.North, Direction.West
    );
    //  _\
    detectVisibleAreaOctant( eyeCell, viewDistance, grid, -1, 0,
                             Direction.NorthWest.subIndex, Direction.NorthEast.subIndex,
                             -1, Vec2.Y_IDX, yMax, xMax, squareViewDistance, viewDistanceSquared,
                             visionCells, Direction.SouthEast.subIndex, Direction.East, Direction.South
    );
    //  "/
    detectVisibleAreaOctant( eyeCell, viewDistance, grid, 0, 1,
                             Direction.NorthEast.subIndex, Direction.NorthWest.subIndex,
                             -1, Vec2.Y_IDX, yMax, xMax, squareViewDistance, viewDistanceSquared,
                             visionCells, Direction.NorthEast.subIndex, Direction.East, Direction.North
    );
    //  /_
    detectVisibleAreaOctant( eyeCell, viewDistance, grid, -1, 0,
                             Direction.NorthEast.subIndex, Direction.NorthWest.subIndex,
                             1, Vec2.Y_IDX, yMax, xMax, squareViewDistance, viewDistanceSquared,
                             visionCells, Direction.SouthWest.subIndex, Direction.West, Direction.South
    );
    //  \"
    detectVisibleAreaOctant( eyeCell, viewDistance, grid, 0, 1,
                             Direction.NorthWest.subIndex, Direction.NorthEast.subIndex,
                             1, Vec2.Y_IDX, yMax, xMax, squareViewDistance, viewDistanceSquared,
                             visionCells, Direction.NorthWest.subIndex, Direction.West, Direction.North
    );
}

function detectVisibleAreaOctant(
    eyeCell,
    viewDistance,
    grid,
    initialMinSlope,
    initialMaxSlope,
    innerDirection,
    outerDirection,
    depthDirection,
    lateralIndex,
    lateralMax,
    depthMax,
    squareViewDistance,
    viewDistanceSquared,
    visionCells,
    betweenDirection,
    facingDirection,
    sideFacingDirection
) {

    let depthIndex = Vec2.getOtherIndex(lateralIndex);

    let frame = STACK.push();
    frame.minSlope = initialMinSlope;
    frame.maxSlope = initialMaxSlope;
    frame.depth = 1;
    frame.visibility = 1;

    while (!STACK.empty) {
        let currentFrame = STACK.pop();
        let minSlope = currentFrame.minSlope;
        let maxSlope = currentFrame.maxSlope;
        let depth = currentFrame.depth;
        let visibility = currentFrame.visibility;
        /* last usage of currentFrame */

        /* Don't scan further out than the observer's view distance */
        if (depth > squareViewDistance) {
            continue;
        }

        let depthAbsoluteIndex = eyeCell.coord.arrayGet(depthIndex) + (depth * depthDirection);
        if (depthAbsoluteIndex < 0 || depthAbsoluteIndex > depthMax) {
            continue;
        }

        let eyeCellLateralPosition = eyeCell.centre.arrayGet(lateralIndex);

        let innerDepthOffset = depth - 0.5;
        let outerDepthOffset = innerDepthOffset + 1;

        /* Find minimum indices for scanning */
        let minInnerLateralPosition = eyeCellLateralPosition + (minSlope * innerDepthOffset);
        let minOuterLateralPosition = eyeCellLateralPosition + (minSlope * outerDepthOffset);

        let partialStartIndex =
            Math.floor(Math.min(minInnerLateralPosition, minOuterLateralPosition));

        /* Stop if we're off the edge of the grid */
        if (partialStartIndex > lateralMax) {
            continue;
        }

        /* Find maximum indices for scanning */
        let maxInnerLateralPosition = eyeCellLateralPosition + (maxSlope * innerDepthOffset) - 1;
        let maxOuterLateralPosition = eyeCellLateralPosition + (maxSlope * outerDepthOffset) - 1;

        let partialStopIndex =
            Math.ceil(Math.max(maxInnerLateralPosition, maxOuterLateralPosition));

        /* Stop if we're off the edge of the grid */
        if (partialStopIndex < 0) {
            continue;
        }

        let startIndex = constrain(0, partialStartIndex, lateralMax);
        let stopIndex = constrain(0, partialStopIndex, lateralMax);

        let firstIteration = true;
        let previousOpaque = false;
        let previousVisibility = -1;
        let previousDescription = null;

        COORD_IDX.arraySet(depthIndex, depthAbsoluteIndex);


        COORD_IDX.arraySet(lateralIndex, startIndex);
        let startCell = grid.get(COORD_IDX);
        COORD_IDX.arraySet(lateralIndex, stopIndex);
        let stopCell = grid.get(COORD_IDX);

        let startSlope = computeSlope(eyeCell.centre, startCell.corners[betweenDirection],
                        lateralIndex, depthIndex);

        let startDescription = visionCells.getDescription(startCell);
        if (initialMaxSlope == 0) {
            if (Math.abs(minSlope) < Math.abs(startSlope)) {
                startDescription.setSide(facingDirection, true);
            }
        } else {
            startDescription.setSide(facingDirection, true);
        }

        let stopSlope = computeSlope(eyeCell.centre, stopCell.corners[betweenDirection],
                        lateralIndex, depthIndex);

        let stopDescription = visionCells.getDescription(stopCell);
        if (initialMaxSlope == 1) {
            if (Math.abs(maxSlope) < Math.abs(stopSlope)) {
                stopDescription.setSide(facingDirection, true);
            }
        } else {
            stopDescription.setSide(facingDirection, true);
        }



        for (let i = startIndex; i <= stopIndex; ++i) {
            let lastIteration = i === stopIndex;

            COORD_IDX.arraySet(lateralIndex, i);
            let cell = grid.get(COORD_IDX);
            let description = visionCells.getDescription(cell);

            if (COORD_IDX.getDistanceSquared(eyeCell.coord) < viewDistanceSquared) {
                description.visibility = Math.max(description.visibility, visibility);
            }

            let currentVisibility = Math.max(visibility - cell.opacity, 0);

            previousOpaque = previousVisibility === 0;
            let currentOpaque = currentVisibility === 0;

            if (currentOpaque) {
                if (!(firstIteration || lastIteration)) {
                    description.setSide(facingDirection, true);
                }
            } else {
                description.setAllSides(true);
            }

            let nextMinSlope = minSlope;
            let change = !firstIteration && currentVisibility != previousVisibility;

            if (change && !currentOpaque) {
                let direction = previousOpaque ? innerDirection : outerDirection;
                nextMinSlope = computeSlope(eyeCell.centre, cell.corners[direction],
                                            lateralIndex, depthIndex
                                ) * depthDirection;

                if (initialMaxSlope == 0 && previousOpaque) {
                    previousDescription.setSide(sideFacingDirection, true);
                }
            }

            if (change && !previousOpaque) {
                let newMaxSlope = computeSlope(eyeCell.centre, cell.corners[outerDirection],
                                            lateralIndex, depthIndex
                                    ) * depthDirection;
                let frame = STACK.push();
                frame.minSlope = minSlope;
                frame.maxSlope = newMaxSlope;
                frame.depth = depth + 1;
                frame.visibility = previousVisibility;

                if (initialMaxSlope == 1 && currentOpaque) {
                    description.setSide(sideFacingDirection, true);
                }
            }

            minSlope = nextMinSlope;

            if (!currentOpaque && lastIteration) {
                let frame = STACK.push();
                frame.minSlope = minSlope;
                frame.maxSlope = maxSlope;
                frame.depth = depth + 1;
                frame.visibility = currentVisibility;
            }

            previousVisibility = currentVisibility;
            previousDescription = description;
            firstIteration = false;
        }
    }

}
