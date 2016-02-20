import {Config} from './config.js';

import {Controller} from './controller.js';
import {GlobalDrawer} from './global_drawer.js';
import {Turn} from './turn.js';

import {Actions} from './actions.js';

export class MoveTowardsPlayer extends Controller {
    constructor() {
        super();
        if (Config.DEBUG) {
            this.debugDrawer = GlobalDrawer.Drawer;
        }
    }

    getAction() {
        return new Actions.Wait(this.entity);
    }

    takeTurn() {
        return new Turn(this.getAction());
    }
}
