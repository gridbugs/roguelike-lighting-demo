import {Components} from './components.js';

export class Healing {
    constructor(ecsContext) {
        this.ecsContext = ecsContext;
        this.entities = new Set();
    }

    add(entity) {
        this.entities.add(entity);
    }

    remove(entity) {
        this.entities.delete(entity);
    }

    progress(timeDelta) {
        for (let entity of this.entities) {
            let health = entity.get(Components.Health).value;
            let maxHealth = entity.get(Components.MaxHealth).value;
            let deltaHealth = timeDelta * entity.get(Components.HealthRecovery).rate;
            let newHealth = Math.min(health + deltaHealth, maxHealth);
            entity.get(Components.Health).value = newHealth;
        }
    }
}
