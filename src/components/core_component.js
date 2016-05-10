import {Component} from 'engine/component';
import {Knowledge} from 'knowledge';

import {Components} from 'components';
import {Weapons} from 'weapons';
import {Light as LightImpl} from 'lighting';
import {Vec2} from 'utils/vec2';

class SetComponent extends Component {
    onAdd(entity) {
        super.onAdd(entity);
        this.set.add(entity);
    }

    onRemove(entity) {
        this.set.delete(entity);
        super.onRemove(entity);
    }
}

export class Observer extends Component {
    constructor(observe, viewDistance, familiar = false) {
        super();
        this.observe = observe;
        this.viewDistance = viewDistance;
        this.knowledge = new Knowledge(familiar);
        this.familiar = familiar;
    }

    clone() {
        return new Observer(this.observe, this.viewDistance, this.familiar);
    }

    onAdd(entity) {
        this.knowledge.maybeAddEcsContext(entity.ecsContext);
    }
}

export class Light extends SetComponent {
    constructor(intensity, height) {
        super();
        this.light = new LightImpl(new Vec2(0, 0), intensity, height);
    }

    get set() {
        return this.ecsContext.lighting.entities;
    }

    get intensity() {
        return this.light.intensity;
    }

    set intensity(value) {
        this.light.intensity = intensity;
    }

    get height() {
        return this.light.height;
    }

    set height(value) {
        this.light.height = value;
    }

    updateLight() {
        this.entity.with(Components.Position, (position) => {
            this.light.setCoord(position.vector);
        });
    }

    onAdd(entity) {
        this.light.lightContext = entity.ecsContext.lightContext;
        super.onAdd(entity);
        this.updateLight();
    }
}
