import {Component} from 'engine/component.js';

export class TurnTaker extends Component {
    constructor(controller) {
        super();
        this.controller = controller;
        this.nextTurn = null;
    }

    get scheduled() {
        return this.nextTurn !== null;
    }

    clone() {
        return new TurnTaker(this.controller);
    }

    onAdd(entity) {
        super.onAdd(entity);
        this.controller.entity = entity;
        this.ecsContext.scheduleTurn(entity, 0);
    }

    onRemove(entity) {
        if (this.nextTurn !== null) {
            this.nextTurn.enabled = false;
        }
        super.onRemove(entity);
    }
}

TurnTaker.prototype.takeTurn = async function() {
    return await this.controller.takeTurn();
}
