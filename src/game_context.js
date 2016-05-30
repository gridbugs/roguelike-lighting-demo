import {EcsContext, SpacialHashCell} from 'engine/ecs_context';

/* Globals */
import {GlobalDrawer} from 'global_drawer';
import {GlobalHud} from 'global_hud';

import {PathPlanner} from 'path_planner';

/* Systems */
import {Collision} from 'systems/collision';
import {Door} from 'systems/door';
import {Observation} from 'systems/observation';
import {KnowledgeRenderer} from 'systems/knowledge_renderer';
import {Lighting} from 'systems/lighting';
import {LightMove} from 'systems/light_move';
import {Animation} from 'systems/animation';
import {Shooting} from 'systems/shooting';

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
        this.door = new Door(this);
        this.observation = new Observation(this);
        this.knowledgeRenderer = new KnowledgeRenderer(this, this.drawer);
        this.lighting = new Lighting(this);
        this.lightMove = new LightMove(this);
        this.animation = new Animation(this);
        this.shooting = new Shooting(this);
    }

    runReactiveSystems(action) {
        super.runReactiveSystems(action);

        this.door.run(action);
        this.collision.run(action);
    }

    runRetroactiveSystems(action) {
        super.runRetroactiveSystems(action);

        this.lightMove.run(action);
        this.shooting.run(action);
        this.animation.run();
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
            this.lighting.run();
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

        this.lighting.run();
        this.observation.run(this.playerCharacter);
        this.knowledgeRenderer.run(this.playerCharacter);
        this.hud.update(this.playerCharacter);
    }
}
