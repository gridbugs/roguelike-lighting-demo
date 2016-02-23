import {EcsContext} from './ecs_context.js';

export class Level {
    constructor(generator) {
        this.generator = generator;
        this._ecsContext = new EcsContext();
        this.generated = false;
    }

    generate() {
        this.generator.generate(this._ecsContext);
        this._ecsContext.scheduleInitialTurns();
        this.generated = true;
    }

    get ecsContext() {
        if (!this.generated) {
            this.generate();
        }
        return this._ecsContext;
    }
}
