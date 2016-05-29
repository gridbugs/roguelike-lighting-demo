import {System} from 'engine/system';
import {Actions} from 'actions';
import {Components} from 'components';

export class Animation extends System {
    constructor(ecsContext) {
        super(ecsContext);
        this.entities = new Set();
    }

    run() {
        for (let entity of this.entities) {
            entity.with(Components.Velocity, (velocity) => {
                if (velocity.vector.getLengthSquared() != 0) {
                    this.ecsContext.scheduleAction(
                        new Actions.VelocityMove(entity),
                        1
                    );
                }
            });
        }
    }
}
