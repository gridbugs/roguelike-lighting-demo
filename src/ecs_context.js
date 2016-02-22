import {Entity} from './entity.js';

import {CellGrid, Cell} from './cell_grid.js';
import {ComponentCountingEntitySet} from './entity_set.js';

import {Config} from './config.js';
import {assert} from './assert.js';

import {GlobalDrawer} from './global_drawer.js';
import {GlobalHud} from './global_hud.js';

import {Components} from './components.js';

import {Schedule} from './schedule.js';
import {Collision} from './collision.js';
import {Combat} from './combat.js';
import {Observation} from './observation.js';
import {KnowledgeRenderer} from './knowledge_renderer.js';
import {PathPlanner} from './path_planner.js';
import {msDelay} from './time.js';

class SpacialHashCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.entities = new ComponentCountingEntitySet();
        this.opacity = 0;

        this.recompute();
    }

    recompute() {
        this.opacity = 0;
        for (let entity of this) {
            entity.with(Components.Opacity, (opacity) => {
                this.opacity += opacity.value;
            });
        }
    }

    has(component) {
        return this.entities.hasComponent(component);
    }

    is(component) {
        return this.entities.isComponent(component);
    }

    find(component) {
        if (this.has(component)) {
            for (let entity of this) {
                if (entity.is(component)) {
                    return entity;
                }
            }
        }
        return null;
    }

    *[Symbol.iterator]() {
        yield* this.entities;
    }
}

class SpacialHash extends CellGrid(SpacialHashCell) {}

var instanceCount = 0;

export class EcsContext {
    constructor() {
        this.entities = new Set();
        this.width = Config.GRID_WIDTH;
        this.height = Config.GRID_HEIGHT;
        this.spacialHash = new SpacialHash(this.width, this.height);

        this.initSystems();

        this.id = instanceCount;
        ++instanceCount;
    }

    initSystems() {
        this.drawer = GlobalDrawer.Drawer;
        this.hud = GlobalHud.Hud;

        this.schedule = new Schedule();
        this.pathPlanner = new PathPlanner(this);
        this.collision = new Collision(this);
        this.combat = new Combat(this);
        this.observation = new Observation(this);
        this.knowledgeRenderer = new KnowledgeRenderer(this, this.drawer);
    }

    setPlayerCharacter(playerCharacter) {
        this.playerCharacter = playerCharacter;
    }

    emplaceEntity(components = []) {
        let entity = new Entity(components);
        this.addEntity(entity);
        return entity;
    }

    addEntity(entity) {
        assert(entity.ecsContext === null);
        this.entities.add(entity);
        entity.onAdd(this);

        if (entity.has(Components.PlayerCharacter)) {
            this.setPlayerCharacter(entity);
        }
    }

    removeEntity(entity) {
        assert(entity.ecsContext === this);
        this.entities.delete(entity);
        entity.onRemove(this);
    }

    get turn() {
        return this.schedule.sequenceNumber;
    }

    maybeApplyAction(action) {

        this.collision.run(action);
        this.combat.run(action);

        if (action.success) {
            action.commit(this);
            return true;
        } else {
            return false;
        }
    }

    updatePlayer() {
        this.observation.run(this.playerCharacter);
        this.knowledgeRenderer.run(this.playerCharacter);
        this.hud.update(this.playerCharacter);
    }

    scheduleImmediateAction(action, relativeTime = 0) {
        this.schedule.scheduleTask(async () => {
            if (relativeTime > 0) {
                this.updatePlayer();
                await msDelay(relativeTime);
            }
            this.maybeApplyAction(action);
        }, relativeTime, /* immediate */ true);
    }
}

EcsContext.prototype.takeTurn = async function(entity) {
    if (entity.is(Components.Observer)) {
        this.observation.run(entity);
    }

    if (entity.is(Components.PlayerCharacter)) {
        this.knowledgeRenderer.run(entity);
        this.hud.update(entity);
    }

    var turn = await entity.get(Components.TurnTaker).takeTurn();

    this.maybeApplyAction(turn.action);

    if (entity.is(Components.PlayerCharacter)) {
        await msDelay(1);
    }

    if (turn.reschedule) {
        this.scheduleTurn(entity, turn.time);
    }
}

EcsContext.prototype.scheduleTurn = async function(entity, relativeTime) {
    assert(entity.is(Components.TurnTaker));
    let task = this.schedule.scheduleTask(async () => {
        if (!entity.is(Components.TurnTaker)) {
            return;
        }

        var turnTaker = entity.get(Components.TurnTaker);

        assert(turnTaker.nextTurn !== null);
        turnTaker.nextTurn = null;

        await this.takeTurn(entity);
    }, relativeTime);

    entity.get(Components.TurnTaker).nextTurn = task;
}

EcsContext.prototype.progressSchedule = async function() {
    if (this.playerCharacter.get(Components.Health).value <= 0) {
        console.debug('you died');
        return false;
    }
    await this.schedule.pop().task();
    return true;
}
