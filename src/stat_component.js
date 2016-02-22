import {Component} from './component.js';

export class StatComponent extends Component {
    constructor(value) {
        super();
        this.value = value;
    }

    copyTo(dest) {
        dest.value = this.value;
    }

    clone() {
        return new this.constructor(this.value);
    }
}

export class Dodge extends StatComponent {}
export class Accuracy extends StatComponent {}
export class Attack extends StatComponent {}
export class Defense extends StatComponent {}
