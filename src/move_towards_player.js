import {Config} from './config.js';
import {GlobalDrawer} from './global_drawer.js';
import {Tiles} from './tiles.js';

import {Controller} from './controller.js';

import {Components} from './components.js';
import {Actions} from './actions.js';

import {Directions} from './direction.js';

import {DijkstraMap, DijkstraCell} from './dijkstra_map.js';
import {SafetyMap, SafetyCell} from './safety_map.js';
import {assert} from './assert.js';

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

export class MoveTowardsPlayer extends Controller {
    constructor() {
        super();
        this.debugDrawer = GlobalDrawer.Drawer;
        this.targetMap = new MoveMap(Config.GRID_WIDTH, Config.GRID_HEIGHT, this);
        this.fleeMap = new FleeMap(Config.GRID_WIDTH, Config.GRID_HEIGHT, 20, 2, this);
        this.lastKnownPosition = null;
    }

    getKnowledgeGrid() {
        return this.entity.get(Components.Observer).knowledge.getGrid(this.ecsContext);
    }

    get ecsContext() {
        return this.entity.ecsContext;
    }

    getPlayerCell() {
        let grid = this.getKnowledgeGrid();
        let remembered = null;
        for (let cell of grid) {
            if (cell.has(Components.PlayerCharacter)) {
                if (cell.visible) {
                    return cell;
                }
                remembered = cell;
            }
        }

        return remembered;
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
            this.fleeMap.computeFromCoord(playerCell.coord);
            candidates = this.fleeMap.get(this.entity.cell.coord).getLowestNeighbours();
        } else {
            this.targetMap.computeFromZeroCoord(playerCell.coord);
            candidates = this.targetMap.get(this.entity.cell.coord).getLowestNeighbours();
        }
        let direction = candidates.getRandom().direction;

        return new Actions.Walk(this.entity, direction);
    }
}
