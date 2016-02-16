import {System} from './system.js';

import {Components} from './components.js';

export class Observation extends System {
    constructor(ecsContext) {
        super(ecsContext);
    }

    run(entity) {
        entity.with(Components.Observer, (observer) => {
            let grid = observer.knowledge.getGrid(this.ecsContext);
            for (let cell of observer.observe(entity, this.ecsContext)) {
                let knowledgeCell = grid.get(cell.coord);
                knowledgeCell.clear();
                knowledgeCell.turn = this.ecsContext.turn;
                for (let e of cell) {
                    knowledgeCell.see(e);
                }
                console.debug(knowledgeCell);
            }
            for (let e of this.spacialHash.get(0, 0).entities) {
                observer.knowledge.getGrid(this.ecsContext).get(0, 0).see(e);
            }
        });
    }
}
