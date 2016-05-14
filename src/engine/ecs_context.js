import {Entity} from 'engine/entity';

import {CellGrid, Cell} from 'utils/cell_grid';
import {ComponentCountingEntitySet} from 'engine/entity_set';

import {assert} from 'utils/assert';

import {Position, TurnTaker, PlayerCharacter} from 'engine/engine_components';

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
        if (entity !== null) {
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
            ++instanceCount;
            this.level = level;
            this.entities = new Set();
            this.finalized = false;
            this.playerCharacter = null;
        }

        get width() {
            return this.level.width;
        }

        get height() {
            return this.level.height;
        }

        initSystems() {
            this.schedule = new Schedule();
        }

        finalize() {
            this.initSystems();
            this.spacialHash = new SpacialHash(this.width, this.height);
            for (let entity of this.entities) {
                entity.onAdd(this);
            }
            this.finalize = true;
        }

        emplaceEntity(components = []) {
            let entity = new Entity(components);
            this.addEntity(entity);
            return entity;
        }

        addEntity(entity) {
            assert(entity.ecsContext === null);
            this.entities.add(entity);
            if (this.finalized) {
                entity.onAdd(this);
            }

            if (entity.has(PlayerCharacter)) {
                this.playerCharacter = entity;
            }
        }

        removeEntity(entity) {
            if (entity.ecsContext === this) {
                this.entities.delete(entity);
                entity.onRemove(this);
            }
        }

        get turn() {
            return this.schedule.sequenceNumber;
        }

        applyAction(action) {
            let changes = action.getChanges();
            let cells = new Set();

            for (let change of changes) {
                let entity = change.entity;
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
        }

        updatePlayer() {}

        scheduleImmediateAction(action, relativeTime = 0) {
            this.schedule.scheduleTask(async () => {
                if (this.schedule.immediateTimeDelta > 0) {
                    this.updatePlayer();
                    await msDelay(this.schedule.immediateTimeDelta);
                }
                this.maybeApplyAction(action);
            }, relativeTime, /* immediate */ true);
        }

        runReactiveSystems(action) {}
        runRetroactiveSystems(actionn) {}

        runContinuousSystems(timeDelta) {}

        beforeTurn(entity) {}
        afterTurn(entity) {}

        scheduleTurn(entity, relativeTime) {
            assert(entity.is(TurnTaker));
            let task = this.schedule.scheduleTask(async () => {
                if (!entity.is(TurnTaker)) {
                    return;
                }

                var turnTaker = entity.get(TurnTaker);

                assert(turnTaker.nextTurn !== null);
                turnTaker.nextTurn = null;

                await this.takeTurn(entity);
            }, relativeTime);

            entity.get(TurnTaker).nextTurn = task;
        }
    }

    EcsContextInstance.prototype.takeTurn = async function(entity) {

        this.beforeTurn(entity);

        var turn = await entity.get(TurnTaker).takeTurn();

        this.maybeApplyAction(turn.action);

        if (entity.is(PlayerCharacter)) {
            await msDelay(1);
        }

        if (turn.reschedule) {
            this.scheduleTurn(entity, turn.time);
        }

        this.runContinuousSystems(this.schedule.timeDelta);

        this.afterTurn(entity);
    }

    EcsContextInstance.prototype.progressSchedule = async function() {
        await this.schedule.pop().task();
    }

    return EcsContextInstance;
}
