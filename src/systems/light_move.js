import {ReactiveSystem} from 'engine/reactive_system';
import {Actions} from 'actions';
import {Components} from 'components';

export class LightMove extends ReactiveSystem {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Walk, (action) => {
            action.entity.with(Components.Light, (light) => {
                light.updateLight();
            });
        });
    }
}
