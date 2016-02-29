import * as Control from './control.js';
import * as Input from './input.js';
import {Line} from './line.js';
import {makeEnum, makeTable} from './enum.js';
import {Direction} from './direction.js';
import {Tiles} from './tiles.js';
import {Vec2} from './vec2.js';

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

const InputType = makeEnum([
    'ACCEPT',
    'CANCEL',
    'CONTINUE'
]);

export class PathPlanner {
    constructor(ecsContext) {
        this.ecsContext = ecsContext;
        this.drawer = this.ecsContext.drawer;
        this.coord = new Vec2(0, 0);
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

    drawCoord(coord) {
        this.drawer.redraw();
        this.drawer.drawTileUnstored(Tiles.Target, coord.x, coord.y);
    }
}

PathPlanner.prototype.processInput = async function(accept) {
    var key = await Input.getNonModifierKey();

    switch (key.keyCode) {
        case Input.KEYCODE_ENTER: {
            return InputType.ACCEPT;
        }
        case Input.KEYCODE_ESCAPE: {
            return InputType.CANCEL;
        }
        default: {
            var controlType = Control.controlTypeFromKey(key);
            if (controlType === accept) {
                return InputType.ACCEPT;
            }
            if (controlType === null) {
                return InputType.CONTINUE;
            }

            var direction = DirectionTable[controlType];
            if (direction === undefined) {
                return InputType.CONTINUE;
            }

            var next = this.coord.add(direction.vector);
            if (this.drawer.grid.isValid(next)) {
                this.coord = next;
            }
            return InputType.CONTINUE;
        }
    }

}

PathPlanner.prototype.getCoord = async function(start, accept, fn = null) {
    this.coord = start;

    while (true) {

        if (fn !== null) {
            fn(this.coord);
        }

        this.drawCoord(this.coord);

        var input = await this.processInput(accept);

        switch (input) {
            case InputType.ACCEPT:
                this.drawer.redraw();
                return this.coord;
            case InputType.CANCEL:
                this.drawer.redraw();
                return null;
        }
    }
}

PathPlanner.prototype.getLine = async function(start, accept, fn = null) {
    this.coord = start;

    while (true) {

        var line = new Line(start, this.coord);

        if (fn !== null) {
            fn(line);
        }

        this.drawLine(line);

        var input = await this.processInput(accept);

        switch (input) {
            case InputType.ACCEPT:
                this.drawer.redraw();
                return line;
            case InputType.CANCEL:
                this.drawer.redraw();
                return null;
        }
    }
}
