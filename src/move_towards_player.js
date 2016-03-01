import {Config} from 'config';
import {GlobalDrawer} from 'global_drawer';
import {Tiles} from 'tiles';

import {Controller} from 'controller';

import {Components} from 'components';
import {Actions} from 'actions';

import {Directions} from 'utils/direction';

import {DijkstraMap, DijkstraCell} from 'utils/dijkstra_map';
import {SafetyMap, SafetyCell} from 'utils/safety_map';
import {assert} from 'utils/assert';

function treatAsSolid(knowledgeCell) {
    if (!knowledgeCell.known) {
        return false;
    }
    if (knowledgeCell.is(Components.Door)) {
        return true;
    }
    if (knowledgeCell.is(Components.Solid)) {
        return false;
    }
    return true;
}

class FleeCell extends SafetyCell {
    isEnterable(cell) {
        return super.isEnterable(cell) && treatAsSolid(this.getKnowledgeCell());
    }

    getKnowledgeCell() {
        return this.grid.controller.getKnowledgeGrid().get(this.coord);
    }
}

class FleeMap extends SafetyMap(FleeCell) {
    constructor(width, height, threshold, delay, controller) {
        super(width, height, threshold, delay);
        this.controller = controller;
    }
}
FleeMap.instance = new FleeMap(Config.GRID_WIDTH, Config.GRID_HEIGHT, 20, 2, null);

class MoveCell extends DijkstraCell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.transferCost = 0;
        this.direction = null;
    }

    isEnterable() {
        let knowledgeCell = this.getKnowledgeCell();
        return treatAsSolid(knowledgeCell);
    }

    getKnowledgeCell() {
        return this.grid.controller.getKnowledgeGrid().get(this.coord);
    }

    debugDraw() {
        this.grid.controller.debugDrawer.drawTileUnstored(Tiles.getDebug(
                    Math.floor(this.value)), this.x, this.y);
    }
}

class MoveMap extends DijkstraMap(MoveCell) {
    constructor(width, height, controller) {
        super(width, height);
        this.controller = controller;
    }

    debugDraw() {
        super.debugDraw(this.controller.debugDrawer);
    }
}
MoveMap.instance = new MoveMap(Config.GRID_WIDTH, Config.GRID_HEIGHT, null);

export class MoveTowardsPlayer extends Controller {
    constructor() {
        super();
        this.debugDrawer = GlobalDrawer.Drawer;
        this.targetMap = MoveMap.instance;
        this.fleeMap = FleeMap.instance;
        this.lastKnownPosition = null;
    }

    getKnowledgeGrid() {
        return this.entity.get(Components.Observer).knowledge.getGrid(this.ecsContext);
    }

    get ecsContext() {
        return this.entity.ecsContext;
    }

    getPlayerCell() {
        let actualPlayerCell = this.entity.ecsContext.playerCharacter.cell;
        let grid = this.getKnowledgeGrid();
        let knowledgeCell = grid.get(actualPlayerCell.coord);
        if (knowledgeCell.visible) {
            return knowledgeCell;
        }
        return null;
    }

    getAction() {
        let playerCell = this.getPlayerCell();

        if (playerCell === null) {
            if (this.lastKnownPosition === null) {
                return new Actions.Wait(this.entity);
            } else {
                playerCell = this.lastKnownPosition;
            }
        } else {
            this.lastKnownPosition = playerCell;
        }

        let health = this.entity.get(Components.Health).value;
        let maxHealth = this.entity.get(Components.MaxHealth).value;

        let candidates;
        if (health / maxHealth < 0.5) {
            this.fleeMap.controller = this;
            this.fleeMap.computeFromCoord(playerCell.coord);
            candidates = this.fleeMap.get(this.entity.cell.coord).getLowestNeighbours();
        } else {
            this.targetMap.controller = this;
            this.targetMap.computeFromZeroCoord(playerCell.coord);
            candidates = this.targetMap.get(this.entity.cell.coord).getLowestNeighbours();
        }
        let direction = candidates.getRandom().direction;

        return new Actions.Walk(this.entity, direction);
    }
}
