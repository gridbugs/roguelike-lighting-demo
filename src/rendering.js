import {Tiles} from 'tiles';
import {Components} from 'components';

function getEntityTile(entity) {
    if (entity.has(Components.Tile)) {
        return entity.get(Components.Tile).tile;
    }
    return Tiles.NoTile;
}

function getForegroundTile(knowledgeCell) {
    return getEntityTile(knowledgeCell.topEntityMemory.best);
}

function getBackgroundTile(knowledgeCell) {
    return getEntityTile(knowledgeCell.topBackgroundEntityMemory.best);
}

function drawUnknownKnowledgeCell(knowledgeCell, drawerCell) {
    drawerCell.drawTile(Tiles.Unknown.main);
}

function drawVisibleKnowledgeCell(knowledgeCell, drawerCell) {
    let foregroundTile = getForegroundTile(knowledgeCell);
    if (foregroundTile.transparent) {
        let backgroundTile = getBackgroundTile(knowledgeCell);
        drawerCell.drawTile(backgroundTile.main);
    }
    drawerCell.drawTile(foregroundTile.main);
}

function drawRememberedKnowledgeCell(knowledgeCell, drawerCell) {
    let foregroundTile = getForegroundTile(knowledgeCell);
    if (foregroundTile.transparent) {
        let backgroundTile = getBackgroundTile(knowledgeCell);
        drawerCell.drawTile(backgroundTile.greyScale);
    }
    drawerCell.drawTile(foregroundTile.greyScale);
}

function drawKnowledgeCell(knowledgeCell, drawerCell) {
    if (!knowledgeCell.known) {
        drawUnknownKnowledgeCell(knowledgeCell, drawerCell);
    } else if (knowledgeCell.visible) {
        drawVisibleKnowledgeCell(knowledgeCell, drawerCell);
    } else {
        drawRememberedKnowledgeCell(knowledgeCell, drawerCell);
    }
}

function maybeDrawKnowledgeCell(knowledgeCell, drawerCell) {
    if (knowledgeCell === null) {
        drawerCell.drawTile(Tiles.OutOfBounds.main);
    } else {
        drawKnowledgeCell(knowledgeCell, drawerCell);
    }
}

export function renderKnowledgeGrid(knowledgeGrid, drawer, xOffset = 0, yOffset = 0) {
    let width = drawer.width;
    let height = drawer.height;

    drawer.clear();

    for (let drawerCell of drawer.grid) {
        let xKnowledgeIndex = drawerCell.x + xOffset;
        let yKnowledgeIndex = drawerCell.y + yOffset;

        let knowledgeCell = knowledgeGrid.get(xKnowledgeIndex, yKnowledgeIndex);
        maybeDrawKnowledgeCell(knowledgeCell, drawerCell);
   }
}
