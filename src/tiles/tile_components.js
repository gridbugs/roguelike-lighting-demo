import {Components} from 'components';

export function hasBackground(entity) {
    if (entity.has(Components.Tile)) {
        return !entity.get(Components.Tile).family.transparent;
    }
    if (entity.has(Components.WallTile)) {
        return true;
    }

    return false;
}

export function hasTileComponent(entity) {
    return getTileComponent(entity) != null;
}

export function getTileComponent(entity) {
    if (entity.has(Components.Tile)) {
        return entity.get(Components.Tile);
    }
    if (entity.has(Components.WallTile)) {
        return entity.get(Components.WallTile);
    }

    return null;
}

export function getTileDepth(entity) {
    return getTileComponent(entity).depth;
}
