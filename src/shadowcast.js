import {Vec2} from 'utils/vec2';
import {Direction, combine} from 'utils/direction';
import {constrain} from 'utils/arith';
import {ObjectStack} from 'utils/object_stack';
import {ObjectPool} from 'utils/object_pool';
import {assert} from 'utils/assert';
import {radiansToDegrees as r2d} from 'utils/angle';
import {RangeTable, RangeTableEntry} from 'utils/range_table';
import {PI, NEGATIVE_PI} from 'utils/constants';

const NUM_OCTANTS = 8;
const OCTANT_ANGLE_RANGE = PI / 4; // 45 degrees
const COORD_IDX = new Vec2(0, 0);
const FRAME_STACK_INITIAL_SIZE = 64;

class StackFrame {
    constructor() {
        this.minSlope = 0;
        this.maxSlope = 0;
        this.depth = 0;
        this.visibility = 0;
    }
}

const STACK = new ObjectStack(StackFrame, FRAME_STACK_INITIAL_SIZE);

function exclusiveFloor(x) {
    return Math.ceil(x - 1);
}

class Octant {
    constructor(depthDirection, lateralDirection) {

        /* Direction to proceed in with each successive scan */
        this.depthDirection = depthDirection;

        /* Direction to scan */
        this.lateralDirection = lateralDirection;

        /* Vec2 index associated with the depth direction */
        this.depthIndex = depthDirection.vec2Index;

        /* Vec2 index associated with the lateral direction */
        this.lateralIndex = lateralDirection.vec2Index;

        /* Change to coord's depth component as depth increases */
        this.depthStep = depthDirection.vector.arrayGet(this.depthIndex);

        /* Change to coord's lateral component as depth increases */
        this.lateralStep = lateralDirection.vector.arrayGet(this.lateralIndex);

        /* During a scan, if the current cell has more opacity than the
         * previous cell, use the gradient through this corner of the
         * CURRENT cell to split the visible area. */
        this.opacityIncreaseCorner = combine(depthDirection, lateralDirection.opposite);

        /* As above, but to be used when the current cell has less opacity
         * than the previous cell. */
        this.opacityDecreaseCorner = combine(depthDirection.opposite, lateralDirection.opposite);

        /* Rounding functions to use to convert floating point positions
         * into coordinates. */
        if (this.lateralStep == 1) {
            this.roundStart = Math.floor;
            this.roundStop = exclusiveFloor;
        } else {
            assert(this.lateralStep == -1);
            this.roundStart = exclusiveFloor;
            this.roundStop = Math.floor;
        }

        /* Side of a cell facing the eye */
        this.facingSide = depthDirection.opposite;

        /* Side facing across eye */
        this.acrossSide = lateralDirection.opposite;

        /* Corner of a cell closest to the eye in this octant */
        this.facingCorner = combine(this.facingSide, this.acrossSide);

        /* Whether the scan direction is clockwise about the eye */
        if (lateralDirection == depthDirection.left90) {
            this.clockwise = true;
        } else {
            assert(depthDirection == lateralDirection.left90);
            this.clockwise = false;
        }
    }
}

/* Array containing all octants.
 * The order octants appear in this array is the order one would
 * visit an octant if they started at -PI radians, and moved in
 * the positive (or anticlockwise) direction.
 */
const OCTANTS = [
    new Octant(Direction.West, Direction.South),
    new Octant(Direction.South, Direction.West),
    new Octant(Direction.South, Direction.East),
    new Octant(Direction.East, Direction.South),
    new Octant(Direction.East, Direction.North),
    new Octant(Direction.North, Direction.East),
    new Octant(Direction.North, Direction.West),
    new Octant(Direction.West, Direction.North),
];

/* Lookup table mapping an angle to the octant that angle appears in */
let OCTANT_TABLE = new RangeTable(NEGATIVE_PI, PI, OCTANTS);
let OCTANT_TABLE_ENTRY_POOL = new ObjectPool(RangeTableEntry, NUM_OCTANTS);

function computeSlope(fromVec, toVec, lateralIndex, depthIndex) {
    return Math.abs((toVec.arrayGet(lateralIndex) - fromVec.arrayGet(lateralIndex)) /
                    (toVec.arrayGet(depthIndex) - fromVec.arrayGet(depthIndex)));
}

export function detectVisibleArea(eyePosition, viewDistance, grid, visionCells) {
    let eyeCell = grid.get(eyePosition);
    let viewDistanceSquared = viewDistance * viewDistance;

    visionCells.addAllSides(eyeCell, 1);

    for (let octant of OCTANTS) {
        detectVisibleAreaOctant(octant, eyeCell, viewDistance, viewDistanceSquared, grid,
                                visionCells, 0, 1);
    }
}

/* Takes an angle relative to the right-most edge of an octant
 * and returns the corresponding gradient within that octant */
function angleToSlope(octant, angle) {

    if (!octant.clockwise) {
        // use the angle relative to the cardinal edge of the octant
        angle = OCTANT_ANGLE_RANGE - angle;
    }

    return Math.tan(angle);
}

export function detectVisibleAreaConstrained(eyePosition, viewDistance, grid, visionCells,
                                             startAngle, stopAngle) {
    let eyeCell = grid.get(eyePosition);
    let viewDistanceSquared = viewDistance * viewDistance;

    visionCells.addAllSides(eyeCell, 1);

    /* Empty the octant table entry pool */
    OCTANT_TABLE_ENTRY_POOL.flush();

    /* Populate the octant table entry pool with octants making up the range
     * of angles within the visible area. */
    OCTANT_TABLE.getRange(startAngle, stopAngle, OCTANT_TABLE_ENTRY_POOL);

    for (let entry of OCTANT_TABLE_ENTRY_POOL) {
        let octant = entry.value;

        let startSlope = angleToSlope(octant, entry.startOffset);
        let endSlope = angleToSlope(octant, entry.endOffset);

        let minSlope, maxSlope;
        if (startSlope < endSlope) {
            minSlope = startSlope;
            maxSlope = endSlope;
        } else {
            minSlope = endSlope;
            maxSlope = startSlope;
        }

        detectVisibleAreaOctant(octant, eyeCell, viewDistance, viewDistanceSquared, grid,
                                visionCells, minSlope, maxSlope);
    }
}

function detectVisibleAreaOctant(octant, eyeCell, viewDistance, viewDistanceSquared, grid,
                                 visionCells, initialMinSlope, initialMaxSlope) {

    /* Maximum coordinates of the grid */
    let depthMax = grid.limits.arrayGet(octant.depthIndex);
    let lateralMax = grid.limits.arrayGet(octant.lateralIndex);

    /* Eye centre coordinates using depth and lateral directions of octant */
    let eyeCellDepthPosition = eyeCell.centre.arrayGet(octant.depthIndex);
    let eyeCellLateralPosition = eyeCell.centre.arrayGet(octant.lateralIndex);

    /* Eye coordinates using depth and lateral directions of octant */
    let eyeCellDepthIndex = eyeCell.coord.arrayGet(octant.depthIndex);
    let eyeCellLateralIndex = eyeCell.coord.arrayGet(octant.lateralIndex);

    /* Create initial stack frame */
    let frame = STACK.push();
    frame.minSlope = initialMinSlope;
    frame.maxSlope = initialMaxSlope;
    frame.depth = 1;
    frame.visibility = 1;

    while (!STACK.empty) {
        /* Get next stack frame */
        let currentFrame = STACK.pop();
        let minSlope = currentFrame.minSlope;
        let maxSlope = currentFrame.maxSlope;
        let depth = currentFrame.depth;
        let visibility = currentFrame.visibility;
        /* last usage of currentFrame */

        assert(minSlope >= 0 && minSlope <= 1);
        assert(maxSlope >= 0 && maxSlope <= 1);

        /* Don't scan further out than the observer's view distance */
        if (depth > viewDistance) {
            continue;
        }

        /* Absolute grid index in depth direction of current row */
        let depthAbsoluteIndex = eyeCellDepthIndex + depth * octant.depthStep;

        /* Don't scan to a depth that's off the grid */
        if (depthAbsoluteIndex < 0 || depthAbsoluteIndex > depthMax) {
            continue;
        }

        /* Distance from centre of eye to inner-side of row */
        let innerDepthOffset = depth - 0.5;

        /* Distance from centre of eye to outer-side of row */
        let outerDepthOffset = innerDepthOffset + 1;

        /* Index to start scan */
        let relativeScanStartIndex = minSlope * innerDepthOffset;
        let absoluteScanStartIndex =
            octant.roundStart(eyeCellLateralPosition + relativeScanStartIndex * octant.lateralStep);

        /* Make sure start index is in the grid. The scan always moves away from
         * the eye in the lateral direction, so if it starts off the grid, it will
         * also end off the grid. Thus it's safe to skip this scan if the start is
         * off the grid. */
        if (absoluteScanStartIndex < 0 || absoluteScanStartIndex > lateralMax) {
            continue;
        }

        /* Index to stop scan */
        let relativeScanStopIndex = maxSlope * outerDepthOffset;
        let absoluteScanStopIndex =
            octant.roundStop(eyeCellLateralPosition + relativeScanStopIndex * octant.lateralStep);

        /* Constrain the stop index within the grid. It's possible that a scan will
         * start inside the grid and end outside. Constaining the stop index will
         * prevent scanning off the grid in the lateral direction. */
        absoluteScanStopIndex = constrain(0, absoluteScanStopIndex, lateralMax);

        let firstIteration = true;

        /* Information about the previous cell */
        let previousOpaque = false;
        let previousVisibility = -1;
        let previousDescription = null;

        /* Set the depth component of the coord index */
        COORD_IDX.arraySet(octant.depthIndex, depthAbsoluteIndex);

        /* The index to stop iterating when reached */
        let finalIndex = absoluteScanStopIndex + octant.lateralStep;

        for (let i = absoluteScanStartIndex; i != finalIndex; i += octant.lateralStep) {
            let lastIteration = i == absoluteScanStopIndex;

            COORD_IDX.arraySet(octant.lateralIndex, i);

            let cell = grid.get(COORD_IDX);
            let description = visionCells.getDescription(cell);

            if (COORD_IDX.getDistanceSquared(eyeCell.coord) < viewDistanceSquared) {
                description.visibility = Math.max(description.visibility, visibility);
            }

            let currentVisibility = Math.max(visibility - cell.opacity, 0);
            let currentOpaque = currentVisibility == 0;

            if (currentOpaque) {
                if (!lastIteration) {
                    description.setSide(octant.facingSide, true);
                }
            } else {
                description.setAllSides(true);
            }

            if (!firstIteration) {
                let corner = null;
                if (currentVisibility > previousVisibility) {
                    corner = cell.corners[octant.opacityDecreaseCorner.subIndex];
                } else if (currentVisibility < previousVisibility) {
                    corner = cell.corners[octant.opacityIncreaseCorner.subIndex];
                }
                if (corner != null) {
                    let slope = computeSlope(eyeCell.centre, corner, octant.lateralIndex, octant.depthIndex);

                    assert(slope >= 0 && slope <= 1);

                    if (!previousOpaque) {
                        let frame = STACK.push();
                        frame.minSlope = minSlope;
                        frame.maxSlope = slope;
                        frame.depth = depth + 1;
                        frame.visibility = previousVisibility;
                    }
                    minSlope = slope;

                    if (currentOpaque) {
                        description.setSide(octant.acrossSide, true);
                    }
                }
            }

            if (lastIteration) {
                if (currentOpaque) {
                    let corner = cell.corners[octant.facingCorner.subIndex];
                    let slope = computeSlope(eyeCell.centre, corner, octant.lateralIndex, octant.depthIndex);
                    if (maxSlope >= slope) {
                        description.setSide(octant.facingSide, true);
                    }
                } else {
                    let frame = STACK.push();
                    frame.minSlope = minSlope;
                    frame.maxSlope = maxSlope;
                    frame.depth = depth + 1;
                    frame.visibility = currentVisibility;
                }
            }

            previousOpaque = currentOpaque;
            previousVisibility = currentVisibility;
            previousDescription = description;
            firstIteration = false;
        }
    }
}
