import {System} from 'engine/system';
import {Components} from 'components';

import {renderKnowledgeGrid} from 'rendering';
import {Config} from 'config';
import {getWindowOffset} from 'utils/scroll';

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

        if (observer != null) {

            let position = entity.get(Components.Position);
            let offset = getWindowOffset(position.vector.x, position.vector.y,
                                         this.ecsContext.width, this.ecsContext.height,
                                         Config.GRID_WIDTH, Config.GRID_HEIGHT);

            let grid = observer.knowledge.getGrid(this.ecsContext);
            renderKnowledgeGrid(grid, this.lightContext, this.drawer, offset.x, offset.y);
        }
    }
}
