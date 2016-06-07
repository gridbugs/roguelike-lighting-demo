import {System} from 'engine/system';
import * as Change from 'engine/change';
import {Components} from 'components';

export class Lighting extends System {
    constructor(ecsContext) {
        super(ecsContext);

        this.entities = new Set();
        this.changed = new Set();
    }

    addLightsTouching(entity) {
        let coord = entity.cell.coord;
        let lightCell = this.ecsContext.lightContext.grid.get(coord);
        for (let profile of lightCell.profileList) {
            this.changed.add(profile.light);
        }
    }

    run(action) {
        for (let change of action.changes) {
            let resolvedChange = change.getResolved();
            let entity = resolvedChange.entity;

            if (resolvedChange instanceof Change.UpdateComponentFieldInPlace ||
                resolvedChange instanceof Change.SetComponentField) {
                if (resolvedChange.componentType == Components.Position) {
                    if (entity.has(Components.Light)) {
                        this.changed.add(entity.get(Components.Light).light);
                    } else if (entity.has(Components.DirectionalLight)) {
                        this.changed.add(entity.get(Components.DirectionalLight).light);
                    } else if (entity.has(Components.Opacity)) {
                        this.addLightsTouching(entity);
                    }
                } else if (resolvedChange.componentType == Components.Opacity) {
                    this.addLightsTouching(entity);
                } else if (resolvedChange.componentType == Components.Light) {
                    this.changed.add(entity.get(Components.Light).light);
                } else if (resolvedChange.componentType == Components.DirectionalLight) {
                    this.changed.add(entity.get(Components.DirectionalLight).light);
                }
            } else if (resolvedChange instanceof Change.AddEntity) {
                if (entity.has(Components.Opacity)) {
                    this.addLightsTouching(entity);
                }
                if (entity.has(Components.Light)) {
                    this.changed.add(entity.get(Components.Light).light);
                }
                if (entity.has(Components.DirectionalLight)) {
                    this.changed.add(entity.get(Components.DirectionalLight).light);
                }
            } else if (resolvedChange instanceof Change.RemoveEntity) {
                if (entity.has(Components.Opacity)) {
                    this.addLightsTouching(entity);
                }
            } else if (resolvedChange instanceof Change.AddComponent) {
                if (resolvedChange.componentType == Components.Opacity) {
                    this.addLightsTouching(entity);
                } else if (resolvedChange.componentType == Components.Light) {
                    this.changed.add(entity.get(Components.Light).light);
                } else if (resolvedChange.componentType == Components.DirectionalLight) {
                    this.changed.add(entity.get(Components.DirectionalLight).light);
                }
            } else if (resolvedChange instanceof Change.RemoveComponent) {
                if (resolvedChange.componentType == Components.Opacity) {
                    this.addLightsTouching(entity);
                }
            }
        }
    }

    updateChanged() {
        this.ecsContext.lightContext.beginUpdate();

        for (let light of this.changed) {
            light.updateLitCells();
        }
        this.changed.clear();

        this.updateTotals();

        this.ecsContext.lightContext.endUpdate();
    }

    updateAll() {
        this.ecsContext.lightContext.beginUpdate();

        for (let entity of this.entities) {
            entity.with(Components.Light, (light) => {
                light.light.updateLitCells();
            });
            entity.with(Components.DirectionalLight, (light) => {
                light.light.updateLitCells();
            });
        }

        this.updateTotals();

        this.ecsContext.lightContext.endUpdate();
    }

    updateTotals() {
        let grid = this.ecsContext.lightContext.grid;
        for (let i = 0; i <  grid.size; i++) {
            let cell = grid.array[i];
            cell.updateTotals();
        }
    }
}
