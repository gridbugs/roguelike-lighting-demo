import {Component} from './component.js';

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
        this.controller.entity = entity;
    }
}

TurnTaker.prototype.takeTurn = async function() {
    return await this.controller.takeTurn();
}
