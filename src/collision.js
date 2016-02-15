import {System} from './system.js';
import {Actions} from './actions.js';
import {Components} from './components.js';

export class Collision extends System {
    constructor(ecsContext) {
        super(ecsContext);

        this.on(Actions.Walk, (action) => {
            if (action.entity.is(Components.Collider) &&
                this.getCell(action.destination).is(Components.Solid)) {

                action.success = false;
            }
        });
    }
}
