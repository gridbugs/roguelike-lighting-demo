import {System} from './system.js';

import {Components} from './components.js';

export class Observation extends System {
    constructor(ecsContext) {
        super(ecsContext);
    }

    run(entity) {
        entity.with(Components.Observer, (observer) => {
            for (let e of this.spacialHash.get(0, 0).entities) {
                observer.knowledge.getGrid(this.ecsContext).get(0, 0).see(e);
            }
        });
    }
}
