import {EcsContext} from './ecs_context.js';

export class Level {
    constructor(generator) {
        this.generator = generator;
        this._ecsContext = new EcsContext(this);
        this.generated = false;
    }

    get depth() {
        return this.generator.depth;
    }

    generate() {
        if (!this.generated) {
            this.generator.generate(this, this._ecsContext);
            this.generated = true;
        }
    }

    get ecsContext() {
        if (!this.generated) {
            this.generate();
        }
        return this._ecsContext;
    }
}
