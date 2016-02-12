import {Drawer} from './drawer.js';
export var drawer;
export function init() {
    drawer = new Drawer(document.getElementById('canvas'));
    console.debug(drawer);
}
