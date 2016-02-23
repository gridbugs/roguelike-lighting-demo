import {Component} from './component.js';
import {Knowledge} from './knowledge.js';

import {Components} from './components.js';

export class Tile extends Component {
    constructor(tile, depth) {
        super();
        this.tile = tile;
        this.depth = depth;
    }

    clone() {
        return new Tile(this.tile, this.depth);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.tile = this.tile;
        dest.depth = this.depth;
    }
}

export class WallTile extends Component {
    constructor(frontTile, topTile, depth) {
        super();
        this.frontTile = frontTile;
        this.topTile = topTile;
        this.depth = depth;
    }

    clone() {
        return new WallTile(this.frontTile, this.topTile, this.depth);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.frontTile = this.frontTile;
        dest.topTile = this.topTile;
        dest.depth = this.depth;
    }
}

export class Solid extends Component {
}

export class Collider extends Component {
}

export class Opacity extends Component {
    constructor(value) {
        super();
        this.value = value;
    }

    clone() {
        return new Opacity(this.value);
    }

    copyTo(dest) {
        super.copyTo(dest);
        dest.value = this.value;
    }
}

export class Observer extends Component {
    constructor(observe, viewDistance, familiar = false) {
        super();
        this.observe = observe;
        this.viewDistance = viewDistance;
        this.knowledge = new Knowledge(familiar);
        this.familiar = familiar;
    }

    clone() {
        return new Observer(this.observe, this.viewDistance, this.familiar);
    }
}

export class PlayerCharacter extends Component {
}

export class Projectile extends Component {
}

export class Health extends Component {
    constructor(value) {
        super();
        this.value = value;
    }

    clone() {
        return new Health(this.value);
    }

    copyTo(dest) {
        dest.value = value;
    }
}

export class Combatant extends Component {
    constructor(group) {
        super();
        this.group = group;
    }

    clone() {
        return new Combatant(this.group);
    }

    copyTo(dest) {
        dest.group = this.group;
    }
}

export class FireStarter extends Component {
}

export class Flamable extends Component {
    constructor(time) {
        super();
        this.time = time;
    }

    clone() {
        return new Flamable(this.time);
    }

    copyTo(dest) {
        dest.time = this.time;
    }
}

export class Burning extends Component {
    constructor(time) {
        super();
        this.time = time;
    }

    onAdd(entity) {
        super.onAdd(entity);
        this.ecsContext.fire.add(entity);
    }

    onRemove(entity) {
        this.ecsContext.fire.remove(entity);
        super.onRemove(entity);
    }

    clone() {
        return new Burning(this.time);
    }

    copyTo(dest) {
        dest.time = this.time;
    }

}

export class Unfamiliar extends Component {
}
