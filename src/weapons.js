import {EntityPrototypes} from 'entity_prototypes';
import {Actions} from 'actions';
import {ControlTypes} from 'control';

export const Pistol = {
    use: async function (entity) {
        var line = await entity.ecsContext.pathPlanner.getLine(entity.cell.coord, ControlTypes.Fire);
        if (line === null) {
            return null;
        }
        var projectile = entity.ecsContext.emplaceEntity(
            EntityPrototypes.Bullet(line.startCoord.x, line.startCoord.y)
        );
        return new Actions.FireProjectile(entity, projectile, line);
    }
}
