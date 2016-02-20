import {Controller} from './controller.js';
import {GlobalDrawer} from './global_drawer.js';

export class MoveTowardsPlayer extends Controller {
    constructor() {
        super();
        this.debugDrawer = GlobalDrawer.Drawer;
        console.debug(this);
    }
}
