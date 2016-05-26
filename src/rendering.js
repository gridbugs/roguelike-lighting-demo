import {Tiles} from 'tiles';
import {Components} from 'components';
import {constrain} from 'utils/arith';

function getEntityTile(entity) {
    if (entity.has(Components.Tile)) {
        return entity.get(Components.Tile).family;
    }
    if (entity.has(Components.WallTile)) {
        return entity.get(Components.WallTile).frontFamily;
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

function drawLitTile(knowledgeCell, tileFamily, lightCell, drawerCell) {
    let intensity = 0;

    for (let i = 0; i < knowledgeCell.sides.length; ++i) {
        if (knowledgeCell.sides[i]) {
            intensity = Math.max(intensity, Math.floor(lightCell.sides[i]));
        }
    }
    intensity = constrain(0, intensity, tileFamily.lightLevels.length - 1);
    drawerCell.drawTile(tileFamily.lightLevels[intensity]);
}

function drawVisibleKnowledgeCell(knowledgeCell, lightCell, drawerCell) {
    let foregroundTile = getForegroundTile(knowledgeCell);
    if (foregroundTile.transparent) {
        let backgroundTile = getBackgroundTile(knowledgeCell);
        drawLitTile(knowledgeCell, backgroundTile.background, lightCell, drawerCell);
    }
    drawLitTile(knowledgeCell, foregroundTile, lightCell, drawerCell);
}

function drawRememberedKnowledgeCell(knowledgeCell, drawerCell) {
    let foregroundTile = getForegroundTile(knowledgeCell);
    if (foregroundTile.transparent) {
        let backgroundTile = getBackgroundTile(knowledgeCell);
        drawerCell.drawTile(backgroundTile.background.greyScale);
    }
    drawerCell.drawTile(foregroundTile.greyScale);
}

function drawKnowledgeCell(knowledgeCell, lightCell, drawerCell) {
    if (!knowledgeCell.known) {
        drawUnknownKnowledgeCell(knowledgeCell, drawerCell);
    } else if (knowledgeCell.visible) {
        drawVisibleKnowledgeCell(knowledgeCell, lightCell, drawerCell);
    } else {
        drawUnknownKnowledgeCell(knowledgeCell, drawerCell);
    }
}

function maybeDrawKnowledgeCell(knowledgeCell, lightCell, drawerCell) {
    if (knowledgeCell == null) {
        drawerCell.drawTile(Tiles.OutOfBounds.main);
    } else {
        drawKnowledgeCell(knowledgeCell, lightCell, drawerCell);
    }
}

export function renderKnowledgeGrid(knowledgeGrid, lightContext, drawer, xOffset = 0, yOffset = 0) {
    let width = drawer.width;
    let height = drawer.height;

    drawer.clear();

    for (let drawerCell of drawer.grid) {
        let xKnowledgeIndex = drawerCell.x + xOffset;
        let yKnowledgeIndex = drawerCell.y + yOffset;

        let knowledgeCell = knowledgeGrid.get(xKnowledgeIndex, yKnowledgeIndex);
        let lightCell = lightContext.grid.get(xKnowledgeIndex, yKnowledgeIndex);
        maybeDrawKnowledgeCell(knowledgeCell, lightCell, drawerCell);
   }
}
