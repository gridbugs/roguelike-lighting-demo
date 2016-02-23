import * as Control from './control.js';
import * as Input from './input.js';
import {Line} from './line.js';
import {makeTable} from './enum.js';
import {Direction} from './direction.js';
import {Tiles} from './tiles.js';

const DirectionTable = makeTable(Control.ControlTypes, {
    West:       Direction.West,
    South:      Direction.South,
    North:      Direction.North,
    East:       Direction.East,
    NorthWest:  Direction.NorthWest,
    NorthEast:  Direction.NorthEast,
    SouthWest:  Direction.SouthWest,
    SouthEast:  Direction.SouthEast
});

export class PathPlanner {
    constructor(ecsContext) {
        this.ecsContext = ecsContext;
        this.drawer = this.ecsContext.drawer;
    }

    drawLine(line) {
        this.drawer.redraw();
        for (let coord of line.absoluteCoords()) {
            if (!coord.equals(line.endCoord)) {
                this.drawer.redrawBackgroundTile(coord.x, coord.y);
                this.drawer.drawTileUnstored(Tiles.Path, coord.x, coord.y);
            }
        }
        this.drawer.drawTileUnstored(Tiles.Target, line.endCoord.x, line.endCoord.y);

    }
}

PathPlanner.prototype.getLine = async function(entity) {
    var start = entity.cell.coord;
    var end = start.clone();

    while (true) {

        var line = new Line(start, end);
        this.drawLine(line);

        var key = await Input.getNonModifierKey();

        switch (key.keyCode) {
            case Input.KEYCODE_ENTER: {
                this.drawer.redraw();
                return line;
            }
            case Input.KEYCODE_ESCAPE: {
                this.drawer.redraw();
                return null;
            }
            default: {
                var controlType = Control.controlTypeFromKey(key);
                switch (controlType) {
                    case Control.ControlTypes.Fire:
                        this.drawer.redraw();
                        return line;
                    default: {
                        if (controlType === null) {
                            continue;
                        }

                        var direction = DirectionTable[controlType];
                        if (direction === undefined) {
                            continue;
                        }

                        var next = end.add(direction.vector);
                        if (this.drawer.grid.isValid(next)) {
                            end = next;
                        }
                        break;
                    }
                }

           }
        }
    }
}
