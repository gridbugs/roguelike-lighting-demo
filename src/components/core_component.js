import {Component, ArrayComponent} from 'engine/component';
import {Knowledge} from 'knowledge';

import {Components} from 'components';
import {Light as LightImpl} from 'lighting';
import {Vec2} from 'utils/vec2';
import {makeEnumInts} from 'utils/enum';

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

export class Observer extends ArrayComponent {
    constructor(observe, viewDistance, familiar = false) {
        super(2);
        this.observe = observe;
        this.viewDistance = viewDistance;
        this.knowledge = new Knowledge(familiar);
        this.familiar = familiar;
    }

    get observe() {
        return this.fields[Observer.Observe];
    }

    set observe(value) {
        this.fields[Observer.Observe] = value;
    }

    get viewDistance() {
        return this.fields[Observer.ViewDistance];
    }

    set viewDistance(value) {
        this.fields[Observer.ViewDistance] = value;
    }

    clone() {
        return new Observer(this.observe, this.viewDistance, this.familiar);
    }

    onAdd(entity) {
        this.knowledge.maybeAddEcsContext(entity.ecsContext);
    }
}
Observer.Observe = 0;
Observer.ViewDistance = 1;

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
