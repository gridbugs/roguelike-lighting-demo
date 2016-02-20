import {Config} from './config.js';
import {GlobalDrawer} from './global_drawer.js';
import {Tiles} from './tiles.js';

import {Controller} from './controller.js';
import {Turn} from './turn.js';

import {Components} from './components.js';
import {Actions} from './actions.js';

import {CellGrid, Cell} from './cell_grid.js';

class DijkstraMapCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.value = 0;
        this.valid = false;
    }
}

class DijkstraMap extends CellGrid(DijkstraMapCell) {
    clear() {
        for (let cell of this) {
            cell.valid = false;
        }
    }
}

export class MoveTowardsPlayer extends Controller {
    constructor() {
        super();
        if (Config.DEBUG) {
            this.debugDrawer = GlobalDrawer.Drawer;
        }
        this.targetMap = new DijkstraMap(Config.GRID_WIDTH, Config.GRID_HEIGHT);
    }

    getKnowledgeGrid() {
        return this.entity.get(Components.Observer).knowledge.getGrid(this.ecsContext);
    }

    get ecsContext() {
        return this.entity.ecsContext;
    }

    getPlayerCell() {
        let grid = this.getKnowledgeGrid();
        for (let cell of grid) {
            if (cell.has(Components.PlayerCharacter)) {
                return cell;
            }
        }

        return null;
    }

    getAction() {

        let playerCell = this.getPlayerCell();


        console.debug(playerCell);

        return new Actions.Wait(this.entity);
    }
}
