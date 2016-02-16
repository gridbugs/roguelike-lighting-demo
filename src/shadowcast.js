import {Vec2} from './vec2.js';
import {Direction} from './direction.js';
import {constrain} from './arith.js';

class StackFrame {
    constructor(minSlope, maxSlope, depth, visibility) {
        this.minSlope = minSlope;
        this.maxSlope = maxSlope;
        this.depth = depth;
        this.visibility = visibility;
    }
}

var COORD_IDX = new Vec2(0, 0);

function computeSlope(fromVec, toVec, lateralIndex, depthIndex) {
    return  (toVec.arrayGet(lateralIndex) - fromVec.arrayGet(lateralIndex)) /
            (toVec.arrayGet(depthIndex) - fromVec.arrayGet(depthIndex));
}

export function* detectVisibleArea(eyePosition, viewDistance, grid) {
    let eyeCell = grid.get(eyePosition);
    let xMax = grid.width - 1;
    let yMax = grid.height - 1;

    yield eyeCell;

    //  \|
    yield* detectVisibleAreaOctant( eyeCell, viewDistance, grid, -1, 0,
                                    Direction.NorthWest.subIndex, Direction.SouthWest.subIndex,
                                    -1, Vec2.X_IDX, xMax, yMax
    );
    //  |/
    yield* detectVisibleAreaOctant( eyeCell, viewDistance, grid, 0, 1,
                                    Direction.SouthWest.subIndex, Direction.NorthWest.subIndex,
                                    -1, Vec2.X_IDX, xMax, yMax
    );
    //  /|
    yield* detectVisibleAreaOctant( eyeCell, viewDistance, grid, -1, 0,
                                    Direction.SouthWest.subIndex, Direction.NorthWest.subIndex,
                                    1, Vec2.X_IDX, xMax, yMax
    );
    //  |\
    yield* detectVisibleAreaOctant( eyeCell, viewDistance, grid, 0, 1,
                                    Direction.NorthWest.subIndex, Direction.SouthWest.subIndex,
                                    1, Vec2.X_IDX, xMax, yMax
    );
    //  _\
    yield* detectVisibleAreaOctant( eyeCell, viewDistance, grid, -1, 0,
                                    Direction.NorthWest.subIndex, Direction.NorthEast.subIndex,
                                    -1, Vec2.Y_IDX, yMax, xMax
    );
    //  "/
    yield* detectVisibleAreaOctant( eyeCell, viewDistance, grid, 0, 1,
                                    Direction.NorthEast.subIndex, Direction.NorthWest.subIndex,
                                    -1, Vec2.Y_IDX, yMax, xMax
    );
    //  /_
    yield* detectVisibleAreaOctant( eyeCell, viewDistance, grid, -1, 0,
                                    Direction.NorthEast.subIndex, Direction.NorthWest.subIndex,
                                    1, Vec2.Y_IDX, yMax, xMax
    );
    //  \"
    yield* detectVisibleAreaOctant( eyeCell, viewDistance, grid, 0, 1,
                                    Direction.NorthWest.subIndex, Direction.NorthEast.subIndex,
                                    1, Vec2.Y_IDX, yMax, xMax
    );
}

function* detectVisibleAreaOctant(
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
    depthMax
) {

    var depthIndex = Vec2.getOtherIndex(lateralIndex);
    var stack = [];
    stack.push(new StackFrame(initialMinSlope, initialMaxSlope, 1, 1));

    var viewDistanceSquared = viewDistance * viewDistance;

    while (stack.length != 0) {
        let currentFrame = stack.pop();
        let minSlope = currentFrame.minSlope;
        let maxSlope = currentFrame.maxSlope;
        let depth = currentFrame.depth;
        let visibility = currentFrame.visibility;

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

        /* Find maximum indices for scanning */
        let maxInnerLateralPosition = eyeCellLateralPosition + (maxSlope * innerDepthOffset) - 1;
        let maxOuterLateralPosition = eyeCellLateralPosition + (maxSlope * outerDepthOffset) - 1;

        let partialStopIndex =
            Math.ceil(Math.max(maxInnerLateralPosition, maxOuterLateralPosition));

        let startIndex = constrain(0, partialStartIndex, lateralMax);
        let stopIndex = constrain(0, partialStopIndex, lateralMax);

        let firstIteration = true;
        let previousOpaque = false;
        let previousVisibility = -1;

        let coordIdx = COORD_IDX;
        coordIdx.arraySet(depthIndex, depthAbsoluteIndex);

        for (let i = startIndex; i <= stopIndex; ++i) {
            let lastIteration = i == stopIndex;

            coordIdx.arraySet(lateralIndex, i);
            let cell = grid.get(coordIdx);

            if (coordIdx.getDistanceSquared(eyeCell.coord) < viewDistanceSquared) {
                yield cell;
            }

            let currentVisibility = Math.max(visibility - cell.opacity, 0);

            previousOpaque = previousVisibility == 0;
            let currentOpaque = currentVisibility == 0;

            let nextMinSlope = minSlope;
            let change = !firstIteration && currentVisibility != previousVisibility;

            if (change && !currentOpaque) {
                let direction = previousOpaque ? innerDirection : outerDirection;
                nextMinSlope = computeSlope(eyeCell.centre, cell.corners[direction],
                                            lateralIndex, depthIndex
                                ) * depthDirection;
            }

            if (change && !previousOpaque) {
                let newMaxSlope = computeSlope(eyeCell.centre, cell.corners[outerDirection],
                                            lateralIndex, depthIndex
                                    ) * depthDirection;
                stack.push(new StackFrame(minSlope, newMaxSlope, depth + 1, previousVisibility));
            }

            minSlope = nextMinSlope;

            if (!currentOpaque && lastIteration) {
                stack.push(new StackFrame(minSlope, maxSlope, depth + 1, currentVisibility));
            }

            previousVisibility = currentVisibility;
            firstIteration = false;
        }
    }
}
