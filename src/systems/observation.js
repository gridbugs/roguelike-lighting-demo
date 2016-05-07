import {System} from 'engine/system';

import {Components} from 'components';
import {VisionCellList} from 'vision';
import {Config} from 'config';


export class Observation extends System {
    constructor(ecsContext) {
        super(ecsContext);

        this.visionCells = new VisionCellList(ecsContext);
        this.visionCellsArray = this.visionCells.array;
    }

    run(entity) {
        entity.with(Components.Observer, (observer) => {
            let knowledgeGrid = observer.knowledge.getGrid(this.ecsContext);

            let grid = this.ecsContext.spacialHash;
            let eyePosition = entity.get(Components.Position).vector;
            let viewDistance = observer.viewDistance;

            this.visionCells.clear();
            observer.observe(eyePosition, viewDistance, grid, this.visionCells);

            for (let i = 0; i < this.visionCells.length; ++i) {
                let visionCell =  this.visionCellsArray[i].cell;
                let cell = grid.get(visionCell);
                let knowledgeCell = knowledgeGrid.get(cell.coord);
                for (let j = 0; j < knowledgeCell.sides.length; ++j) {
                    knowledgeCell.sides[j] = visionCell.description.sides[j];
                }
                if (knowledgeCell.dirty) {
                    knowledgeCell.clear();
                    for (let e of cell.entities.set) {
                        knowledgeCell.see(e);
                    }
                } else {
                    knowledgeCell.turn = this.ecsContext.turn;
                }
            }
        });
    }
}
