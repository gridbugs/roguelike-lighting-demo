import {System} from 'engine/system.js';

import {Components} from 'components.js';

export class Observation extends System {
    constructor(ecsContext) {
        super(ecsContext);
    }

    run(entity) {
        entity.with(Components.Observer, (observer) => {
            let knowledgeGrid = observer.knowledge.getGrid(this.ecsContext);

            let grid = this.ecsContext.spacialHash;
            let eyePosition = entity.get(Components.Position).vector;
            let viewDistance = observer.viewDistance;

            for (let cell of observer.observe(eyePosition, viewDistance, grid)) {
                let knowledgeCell = knowledgeGrid.get(cell.coord);

                knowledgeCell.clear();

                for (let e of cell) {
                    knowledgeCell.see(e);
                }
            }
        });
    }
}
