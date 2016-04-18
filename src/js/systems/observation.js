import {System} from 'engine/system';

import {Components} from 'components';
import {VisionCellList} from 'vision';
import {Config} from 'config';

const visionCells = new VisionCellList(Config.GRID_WIDTH, Config.GRID_HEIGHT);
const visionCellsArray = visionCells.array;

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

            visionCells.clear();
            observer.observe(eyePosition, viewDistance, grid, visionCells);

            for (let i = 0; i < visionCells.length; ++i) {
                let cell =  visionCellsArray[i].cell;
                let knowledgeCell = knowledgeGrid.get(cell.coord);
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
