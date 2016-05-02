import {EcsContext, SpacialHashCell} from 'engine/ecs_context';

/* Globals */
import {GlobalDrawer} from 'global_drawer';
import {GlobalHud} from 'global_hud';

import {PathPlanner} from 'path_planner';

/* Systems */
import {Collision} from 'systems/collision';
import {Observation} from 'systems/observation';
import {KnowledgeRenderer} from 'systems/knowledge_renderer';

/* Components */
import {Components} from 'components';

import {LightContext} from 'lighting';

class GameCell extends SpacialHashCell {
    constructor(x, y, grid) {
        super(x, y, grid);
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
}

export class GameContext extends EcsContext(GameCell) {
    constructor(level) {
        super(level);

        this.victory = false;
    }

    initSystems() {
        super.initSystems();

        this.drawer = GlobalDrawer.Drawer;
        this.hud = GlobalHud.Hud;

        this.pathPlanner = new PathPlanner(this);

        this.collision = new Collision(this);
        this.observation = new Observation(this);
        this.knowledgeRenderer = new KnowledgeRenderer(this, this.drawer);
    }

    runReactiveSystems(action) {
        super.runReactiveSystems(action);

        this.collision.run(action);
    }

    finalize() {
        this.lightContext = new LightContext(this);
        super.finalize();
        for (let entity of this.entities) {
            entity.with(Components.Observer, (observer) => {
                observer.knowledge.getGrid(this).familiarize();
            });
        }
    }

    runContinuousSystems(timeDelta) {
        super.runContinuousSystems(timeDelta);
    }

    beforeTurn(entity) {
        super.beforeTurn(entity);

        if (entity.is(Components.Observer)) {
            this.observation.run(entity);
        }

        if (entity.is(Components.PlayerCharacter)) {
            this.knowledgeRenderer.run(entity);
            this.hud.update(entity);
            this.hud.messageChanged = false;
        }
    }

    afterTurn(entity) {
        super.afterTurn(entity);
    }

    addEntity(entity) {
        super.addEntity(entity);
    }

    removeEntity(entity) {
        super.removeEntity(entity);
    }

    updatePlayer() {
        super.updatePlayer();

        this.observation.run(this.playerCharacter);
        this.knowledgeRenderer.run(this.playerCharacter);
        this.hud.update(this.playerCharacter);
    }
}
