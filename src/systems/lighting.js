import {System} from 'engine/system';
import {Components} from 'components';

export class Lighting extends System {
    constructor(ecsContext) {
        super(ecsContext);

        this.entities = new Set();
    }

    run() {
        for (let entity of this.entities) {
            entity.with(Components.Light, (light) => {
                light.light.updateLitCells();
            });
            entity.with(Components.DirectionalLight, (light) => {
                light.light.updateLitCells();
            });
        }

        let grid = this.ecsContext.lightContext.grid;
        for (let i = 0; i <  grid.size; i++) {
            let cell = grid.array[i];
            cell.updateTotals();
        }
    }
}
