import {Entity} from 'engine/entity';

import {CellGrid, Cell} from 'utils/cell_grid';
import {ComponentCountingEntitySet} from 'engine/entity_set';

import {assert} from 'utils/assert';

import {Position, TurnTaker, PlayerCharacter, Scheduled} from 'engine/engine_components';

import {Schedule} from 'engine/schedule';

import {msDelay} from 'utils/time';

export class SpacialHashCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.entities = new ComponentCountingEntitySet();
        this.turn = 0;
    }

    /* Cells may store precomputed amalgamations such as the opacity
     * of the entire cell (computed from the entity of individual
     * components). Extend this to recompute amalgamated values.
     */
    recompute() {}

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

    withEntity(component, callback) {
        let entity = this.find(component);
        if (entity != null) {
            callback(entity);
        }
    }

    *[Symbol.iterator]() {
        yield* this.entities;
    }
}

let instanceCount = 0;

export function EcsContext(CellType) {
    class SpacialHash extends CellGrid(CellType) {}


    class EcsContextInstance {
        constructor(level) {
            this.id = instanceCount;
            instanceCount++;
            this.level = level;
            this.entities = new Set();
            this.finalized = false;
            this.playerCharacter = null;
            this.turnSchedule = new Schedule();
            this.actionSchedule = new Schedule();
            this.bindings = new Array();
            this.actionCells = new Set();
        }

        get width() {
            return this.level.width;
        }

        get height() {
            return this.level.height;
        }

        initSystems() {
        }

        finalize() {
            this.initSystems();
            this.spacialHash = new SpacialHash(this.width, this.height);
            for (let entity of this.entities) {
                entity.onAdd(this);
            }
            this.finalized = true;
        }

        emplaceEntity(components = []) {
            let entity = new Entity(components);
            this.addEntity(entity);
            return entity;
        }

        addEntity(entity) {
            assert(entity.ecsContext == null);
            this.entities.add(entity);
            if (this.finalized) {
                entity.onAdd(this);
            }
            if (entity.has(PlayerCharacter)) {
                this.playerCharacter = entity;
            }
        }

        removeEntity(entity) {
            if (entity.ecsContext == this) {
                this.entities.delete(entity);
                entity.onRemove(this);
            }
        }

        get turn() {
            return this.turnSchedule.sequenceNumber;
        }

        applyAction(action) {
            let changes = action.changes;
            let cells = this.actionCells;

            cells.clear();

            for (let change of changes) {
                let entity = change.getEntity(this);
                assert(entity.has(Position));

                if (entity.has(Position)) {
                    let position = entity.get(Position);
                    let fromCell = this.spacialHash.get(position.vector);
                    change.apply(this);
                    let toCell = this.spacialHash.get(position.vector);

                    cells.add(fromCell);

                    if (!fromCell.coord.equals(toCell.coord)) {
                        fromCell.entities.delete(entity);
                        toCell.entities.add(entity);
                        entity.cell = toCell;

                        cells.add(toCell);
                    }
                }
            }

            for (let cell of cells) {
                cell.recompute();
                cell.turn = this.turn;
            }
        }

        maybeApplyAction(action) {

            this.runReactiveSystems(action);

            if (action.success) {
                this.applyAction(action);
                this.runRetroactiveSystems(action);
            }

            return action.success;
        }

        updatePlayer() {}

        scheduleAction(action, relativeTime = 0) {

            action.entity.add(new Scheduled());

            this.actionSchedule.scheduleTask(async () => {

                action.entity.remove(Scheduled);

                if (this.maybeApplyAction(action) &&
                    this.actionSchedule.timeDelta > 0) {

                    this.updatePlayer();
                    await msDelay(this.actionSchedule.timeDelta);
                }
            }, relativeTime, /* immediate */ true);
        }

        /* Systems invoked on an action when the action is first proposed.
         * May cancel the action. */
        runReactiveSystems(action) {}

        /* Systems run on an action after it has been committed */
        runRetroactiveSystems(actionn) {}

        /* Systems run at the end of a turn, on the amount of time since
         * the previous turn. */
        runContinuousSystems(timeDelta) {}

        beforeTurn(entity) {}
        afterTurn(entity) {}

        scheduleTurn(entity, relativeTime) {
            assert(entity.is(TurnTaker));
            let task = this.turnSchedule.scheduleTask(async () => {
                if (!entity.is(TurnTaker)) {
                    return;
                }

                var turnTaker = entity.get(TurnTaker);

                assert(turnTaker.nextTurn != null);
                turnTaker.nextTurn = null;

                await this.takeTurn(entity);
            }, relativeTime);

            entity.get(TurnTaker).nextTurn = task;
        }
    }

    EcsContextInstance.prototype.exhaustActionSchedule = async function() {
        while (!this.actionSchedule.empty) {
            await this.actionSchedule.pop().task();
        }
    }

    EcsContextInstance.prototype.takeTurn = async function(entity) {

        this.beforeTurn(entity);

        var turn = await entity.get(TurnTaker).takeTurn();

        this.scheduleAction(turn.action);

        await this.exhaustActionSchedule()

        if (entity.is(PlayerCharacter)) {
            await msDelay(1);
        }

        if (turn.reschedule) {
            this.scheduleTurn(entity, turn.time);
        }

        this.runContinuousSystems(this.turnSchedule.timeDelta);

        this.afterTurn(entity);
    }

    EcsContextInstance.prototype.progressSchedule = async function() {
        await this.turnSchedule.pop().task();
    }

    return EcsContextInstance;
}
