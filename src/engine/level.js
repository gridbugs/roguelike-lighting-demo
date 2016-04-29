import {Vec2} from 'utils/vec2';

export class Level {
    constructor(generator) {
        this.dimensions = new Vec2(0, 0);
        this.generator = generator;
        this._ecsContext = new Level.EcsContext(this);
        this.generated = false;
    }

    set width(value) {
        this.dimensions.x = value;
    }

    set height(value) {
        this.dimensions.y = value;
    }

    get width() {
        return this.dimensions.x;
    }

    get height() {
        return this.dimensions.y;
    }

    get depth() {
        return this.generator.depth;
    }

    generate() {
        if (!this.generated) {
            this.generator.generate(this, this._ecsContext);
            this.generated = true;
            this._ecsContext.finalize();
        }
    }

    get ecsContext() {
        if (!this.generated) {
            this.generate();
        }
        return this._ecsContext;
    }
}
Level.EcsContext = null;
