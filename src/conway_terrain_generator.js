import {Config} from './config.js';
import {EntityPrototypes} from './entity_prototypes.js';
import {Components} from './components.js';
import {Level} from './level.js';
import {CellGrid, Cell} from './cell_grid.js';
import {getRandomBool} from './random.js';
import {getRandomElement} from './array.js';

class ConwayCell extends Cell {
    constructor(x, y, grid) {
        super(x, y, grid);
        this.alive = false;
        this.nextAlive = false;
    }

    step() {
        this.alive = this.nextAlive;
    }

    countAliveNeighbours() {
        let count = 0;
        for (let n of this.neighbours) {
            if (n.alive) {
                ++count;
            }
        }
        return count;
    }
}

class ConwayGrid extends CellGrid(ConwayCell) {}

export class ConwayTerrainGenerator {
    constructor() {
        this.grid = new ConwayGrid(Config.GRID_WIDTH, Config.GRID_HEIGHT);
        this.randomize();
    }

    randomize() {
        for (let cell of this.grid) {
            cell.alive = getRandomBool();
        }
    }

    step(liveMin, liveMax, resMin, resMax) {
        console.debug(liveMin, liveMax, resMin, resMax);
        for (let cell of this.grid) {
            if (cell.isBorder()) {
                cell.nextAlive = true;
                continue;
            }

            let count = cell.countAliveNeighbours();

            if (cell.alive) {
                cell.nextAlive = count >= liveMin && count <= liveMax;
            } else {
                cell.nextAlive = count >= resMin && count <= resMax;
            }
        }

        for (let cell of this.grid) {
            cell.step();
        }
    }

    runAutomata(numSteps, liveMin, liveMax, resMin, resMax) {
        for (let i = 0; i < numSteps; ++i) {
            this.step(liveMin, liveMax, resMin, resMax);
        }
    }

    fillGaps(minNeighbours, iterations) {
        for (let i = 0; i < iterations; ++i) {
            for (let cell of this.grid) {
                let count = cell.countAliveNeighbours();
                if (count > minNeighbours) {
                    cell.alive = true;
                }
            }
        }
    }

    generate(level, ecs) {

        this.runAutomata(2, 4, 8, 5, 5);
        this.fillGaps(4, 4);


        for (let cell of this.grid) {
            ecs.emplaceEntity(EntityPrototypes.IceFloor(cell.x, cell.y));
            if (cell.alive) {
                ecs.emplaceEntity(EntityPrototypes.IceWall(cell.x, cell.y));
            }
        }

        let empty = [];
        for (let cell of this.grid) {
            if (!cell.alive) {
                empty.push(cell);
            }
        }
        let startCell = getRandomElement(empty);
        ecs.emplaceEntity(EntityPrototypes.PlayerCharacter(startCell.coord));
    }
}
