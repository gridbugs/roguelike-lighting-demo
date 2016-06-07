import {assert} from 'utils/assert';
import {CellGrid, Cell} from 'utils/cell_grid';
import {Direction, NumDirections} from 'utils/direction';
import {Components} from 'components';
import {Tiles} from 'tiles';
import {constrain} from 'utils/arith';
import {rgba32IsTransparent} from 'utils/rgba32';

class RendererCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.backgroundCell = null;
        this.foregroundCell = null;
        this.lightingCell = null;
    }

    renderUnknown() {
        this.backgroundCell.drawSprite(Tiles.Unknown.main);
        this.foregroundCell.clear();
    }

    getEntityTileFamily(entity) {
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

    getForegroundTileFamily(knowledgeCell) {
        return this.getEntityTileFamily(knowledgeCell.topEntityMemory.best);
    }

    getBackgroundTileFamily(knowledgeCell) {
        return this.getEntityTileFamily(knowledgeCell.topBackgroundEntityMemory.best);
    }

    renderKnowledge(knowledgeCell, lightCell) {
        if (knowledgeCell.visible) {
            let foregroundTileFamily = this.getForegroundTileFamily(knowledgeCell);
            let backgroundTileFamily = this.getBackgroundTileFamily(knowledgeCell);
            this.drawLitSprite(this.backgroundCell, knowledgeCell, backgroundTileFamily, lightCell);
            this.drawLitSprite(this.foregroundCell, knowledgeCell, foregroundTileFamily, lightCell);
            this.drawColourCell(this.lightingCell, knowledgeCell, lightCell);
        } else {
            this.renderUnknown();
        }
    }

    drawLitSprite(drawerCell, knowledgeCell, tileFamily, lightCell) {
        let intensity = 0;

        for (let i = 0; i < NumDirections; i++) {
            if (knowledgeCell.sides & (1 << i)) {
                let sideIntensty = Math.floor(lightCell.sides[i].intensity);
                intensity = Math.max(intensity, sideIntensty);
            }
        }

        intensity = constrain(0, intensity, tileFamily.lightLevels.length - 1);
        drawerCell.drawSprite(tileFamily.lightLevels[intensity]);
    }

    drawColourCell(drawerCell, knowledgeCell, lightCell) {
        let intensity = 0;
        let bestIndex = -1;

        for (let i = 0; i < NumDirections; i++) {
            if (knowledgeCell.sides & (1 << i)) {
                if (rgba32IsTransparent(lightCell.sides[i].colour)) {
                    continue;
                }

                let sideIntensty = Math.floor(lightCell.sides[i].intensity);
                if (sideIntensty > intensity) {
                    intensity = sideIntensty;
                    bestIndex = i;
                }
            }
        }

        if (bestIndex == -1) {
            return;
        }

        let side = lightCell.sides[bestIndex];
        drawerCell.fillColour(side.colour);
    }
}

class RendererGrid extends CellGrid(RendererCell) {}

export class Renderer {
    constructor(width, height, backgroundDrawer, foregroundDrawer, lightingDrawer) {
        this.width = width;
        this.height = height;
        this.size = width * height;

        this.grid = new RendererGrid(width, height);

        assert(backgroundDrawer.width == this.width);
        assert(backgroundDrawer.height == this.height);
        assert(foregroundDrawer.width == this.width);
        assert(foregroundDrawer.height == this.height);
        assert(lightingDrawer.width == this.width);
        assert(lightingDrawer.height == this.height);

        /* Sprite drawing layers */
        this.backgroundDrawer = backgroundDrawer;
        this.foregroundDrawer = foregroundDrawer;

        /* Colour drawing layer */
        this.lightingDrawer = lightingDrawer;

        /* Save a reference to each drawer cell */
        for (let cell of this.grid) {
            cell.backgroundCell = backgroundDrawer.get(cell.coord);
            cell.foregroundCell = foregroundDrawer.get(cell.coord);
            cell.lightingCell = lightingDrawer.get(cell.coord);
        }
    }

    renderKnowledgeGrid(knowledgeGrid, lightContext, xOffset = 0, yOffset = 0) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let x = j + xOffset;
                let y = i + yOffset;
                let knowledgeCell = knowledgeGrid.getCoord(x, y);
                let lightCell = lightContext.grid.getCoord(x, y);
                let rendererCell = this.grid.getCoord(j, i);
                rendererCell.lightingCell.clear();
                rendererCell.renderKnowledge(knowledgeCell, lightCell);
            }
        }
    }
}
