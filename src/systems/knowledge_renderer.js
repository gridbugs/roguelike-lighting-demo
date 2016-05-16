import {System} from 'engine/system';

import {Components} from 'components';
import {Tiles} from 'tiles';

import {Direction} from 'utils/direction';

import {renderKnowledgeGrid} from 'rendering';
import {Config} from 'config';
import {constrain} from 'utils/math';

const HALF_WIDTH = Math.floor(Config.GRID_WIDTH / 2);
const HALF_HEIGHT = Math.floor(Config.GRID_HEIGHT / 2);

export class KnowledgeRenderer extends System {
    constructor(ecsContext, drawer) {
        super(ecsContext);
        this.lightContext = ecsContext.lightContext;
        this.drawer = drawer;
    }

    run(entity) {
        let observer = entity.get(Components.Observer);
        let position = entity.get(Components.Position);

        let xMaxOffset = this.ecsContext.width - Config.GRID_WIDTH;
        let yMaxOffset = this.ecsContext.height - Config.GRID_HEIGHT;

        let xRealOffset = position.vector.x - HALF_WIDTH;
        let yRealOffset = position.vector.y - HALF_HEIGHT;

        let xOffset = constrain(0, xRealOffset, xMaxOffset);
        let yOffset = constrain(0, yRealOffset, yMaxOffset);

        if (observer != null) {
            let grid = observer.knowledge.getGrid(this.ecsContext);
            renderKnowledgeGrid(grid, this.lightContext, this.drawer, xOffset, yOffset);
        }
    }
}
