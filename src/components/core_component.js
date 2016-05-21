import {Component, ArrayComponent} from 'engine/component';
import {Knowledge} from 'knowledge';

import {Components} from 'components';
import {Light as LightImpl, DirectionalLight as DirectionalLightImpl} from 'lighting';
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

const ObserverParent = ARRAY_TUPLE(EXTENDS(Component), observe, viewDistance);
export class Observer extends ObserverParent {
    constructor(observe, viewDistance, familiar = false) {
        super(observe, viewDistance);
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
Observer.Observe = ObserverParent.Observe;
Observer.ViewDistance = ObserverParent.ViewDistance;

const LightParent = ARRAY_TUPLE(EXTENDS(SetComponent), intensity, height);
export class Light extends LightParent {
    constructor(intensity, height) {
        super(intensity, height);
        this.light = new LightImpl(new Vec2(0, 0), 0, 0);
    }

    get set() {
        return this.ecsContext.lighting.entities;
    }

    updateLight() {
        this.entity.with(Components.Position, (position) => {
            this.light.setCoord(position.vector);
        });
        this.light.intensity = this.intensity;
        this.light.height = this.height;
    }

    onAdd(entity) {
        this.light.lightContext = entity.ecsContext.lightContext;
        super.onAdd(entity);
        this.updateLight();
    }
}
Light.Intensity = LightParent.Intensity;
Light.Height = LightParent.Height;

const DirectionalLightParent = ARRAY_TUPLE(EXTENDS(SetComponent), intensity, height, angle, width);
export class DirectionalLight extends DirectionalLightParent {
    constructor(intensity, height, angle, width) {
        super(intensity, height, angle, width);
        this.light = new DirectionalLightImpl(new Vec2(0, 0), 0, 0, 0, 0);
    }

    get set() {
        return this.ecsContext.lighting.entities;
    }

    updateLight() {
        this.entity.with(Components.Position, (position) => {
            this.light.setCoord(position.vector);
        });
        this.light.intensity = this.intensity;
        this.light.height = this.height;
        this.light.angle = this.angle;
        this.light.width = this.width;
    }

    onAdd(entity) {
        this.light.lightContext = entity.ecsContext.lightContext;
        super.onAdd(entity);
        this.updateLight();
    }
}
DirectionalLight.Intensity = DirectionalLightParent.Intensity;
DirectionalLight.Height = DirectionalLightParent.Height;
DirectionalLight.Angle = DirectionalLightParent.Angle;
DirectionalLight.Width = DirectionalLightParent.Width;
