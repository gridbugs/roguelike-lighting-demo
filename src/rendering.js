import {Tiles} from 'tiles';
import {Components} from 'components';
import {constrain} from 'utils/arith';
import {Direction} from 'utils/direction';
import {Config} from 'config';
import {LazySprite} from 'utils/lazy_sprite';

const LIGHT_COLOUR_MIXER_WIDTH = 100;
const LIGHT_COLOUR_MIXER_HEIGHT = 100;
const LIGHT_COLOUR_MIXER = new LazySprite(
        Config.TILE_WIDTH, Config.TILE_HEIGHT,
        LIGHT_COLOUR_MIXER_WIDTH, LIGHT_COLOUR_MIXER_HEIGHT);
LIGHT_COLOUR_MIXER.ctx.globalCompositeOperation = 'lighter';

function getEntityTile(entity) {
    if (entity.has(Components.Tile)) {
        return entity.get(Components.Tile).family;
    }
    if (entity.has(Components.WallTile)) {
        let south = entity.entity.cell.getNeighbour(Direction.South);
        if (south == null || south.has(Components.WallTile)) {
            return entity.get(Components.WallTile).topFamily;
        } else {
            return entity.get(Components.WallTile).frontFamily;
        }
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

function drawLitTile(knowledgeCell, tileFamily, lightCell, drawerCell, lightSprites) {
    let intensity = 0;
    let brightestSideIndex = -1;

    for (let i = 0; i < knowledgeCell.sides.length; ++i) {
        if (knowledgeCell.sides[i]) {
            let sideIntensty = Math.floor(lightCell.sides[i].intensity);
            if (sideIntensty > intensity) {
                intensity = sideIntensty;
                brightestSideIndex = i;
            }
        }
    }

    intensity = constrain(0, intensity, tileFamily.lightLevels.length - 1);
    drawerCell.drawTile(tileFamily.lightLevels[intensity]);

    if (lightSprites && brightestSideIndex != -1) {
        let side = lightCell.sides[brightestSideIndex];
        if (side.hasSprite) {
            LIGHT_COLOUR_MIXER.clear();
            for (let sprite of side.spriteSet) {
                LIGHT_COLOUR_MIXER.drawSprite(sprite);
            }
            drawerCell.drawTile(LIGHT_COLOUR_MIXER);
        }
    }
}

function drawVisibleKnowledgeCell(knowledgeCell, lightCell, drawerCell) {
    let foregroundTile = getForegroundTile(knowledgeCell);
    if (foregroundTile.transparent) {
        let backgroundTile = getBackgroundTile(knowledgeCell);
        drawLitTile(knowledgeCell, backgroundTile.background, lightCell, drawerCell, false);
    }
    drawLitTile(knowledgeCell, foregroundTile, lightCell, drawerCell, true);
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
