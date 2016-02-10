import {EntityPrototype} from './entity_prototype.js';
import {Components} from './components.js';

export function drawable(x, y, tile) {
    return new EntityPrototype([
        new Components.Position(x, y),
        new Components.Tile(tile)
    ]);
}

export function wall(x, y, tile) {
    return drawable(x, y, tile)
        .add([
            new Components.Solid(),
            new Components.Opacity(1)
        ]);
}

export function tree(x, y, tile) {
    return drawable(x, y, tile)
        .add([
            new Components.Solid(),
            new Components.Opacity(0.5)
        ]);
}
