import {CellGrid, Cell} from './cell_grid.js';
import {ComponentCountingEntitySet} from './entity_set.js';
import {SetWrapper} from './set_wrapper.js';

class SpacialHashCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.entities = new ComponentCountingEntitySet();
    }
}

export class SpacialHash extends CellGrid(SpacialHashCell) {

}
