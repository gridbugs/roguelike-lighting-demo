import {
    Component
} from 'engine/component';
import {
    makeEnumInts
} from 'utils/enum';
export class Door extends Component {
    constructor(open, openTileFamily, closedTileFamily) {
        super();
        this.open = open;
        this.openTileFamily = openTileFamily;
        this.closedTileFamily = closedTileFamily;
    }
    get open() {
        return this.fields[Door.Field.Open];
    }
    set open(value) {
        this.fields[Door.Field.Open] = value;
    }
    get openTileFamily() {
        return this.fields[Door.Field.OpenTileFamily];
    }
    set openTileFamily(value) {
        this.fields[Door.Field.OpenTileFamily] = value;
    }
    get closedTileFamily() {
        return this.fields[Door.Field.ClosedTileFamily];
    }
    set closedTileFamily(value) {
        this.fields[Door.Field.ClosedTileFamily] = value;
    }
    clone() {
        return new Door(this.open, this.openTileFamily, this.closedTileFamily);
    }
    copyTo(dest) {
        super.copyTo(dest);
        dest.open = this.open;
        dest.openTileFamily = this.openTileFamily;
        dest.closedTileFamily = this.closedTileFamily;
    }
}
Door.Field = makeEnumInts('Open', 'OpenTileFamily', 'ClosedTileFamily');
export class Tile extends Component {
    constructor(family, depth) {
        super();
        this.family = family;
        this.depth = depth;
    }
    get family() {
        return this.fields[Tile.Field.Family];
    }
    set family(value) {
        this.fields[Tile.Field.Family] = value;
    }
    get depth() {
        return this.fields[Tile.Field.Depth];
    }
    set depth(value) {
        this.fields[Tile.Field.Depth] = value;
    }
    clone() {
        return new Tile(this.family, this.depth);
    }
    copyTo(dest) {
        super.copyTo(dest);
        dest.family = this.family;
        dest.depth = this.depth;
    }
}
Tile.Field = makeEnumInts('Family', 'Depth');
export class Opacity extends Component {
    constructor(value) {
        super();
        this.value = value;
    }
    get value() {
        return this.fields[Opacity.Field.Value];
    }
    set value(value) {
        this.fields[Opacity.Field.Value] = value;
    }
    clone() {
        return new Opacity(this.value);
    }
    copyTo(dest) {
        super.copyTo(dest);
        dest.value = this.value;
    }
}
Opacity.Field = makeEnumInts('Value');
export class Collider extends Component {
    constructor() {
        super();
    }
    clone() {
        return new Collider();
    }
    copyTo(dest) {
        super.copyTo(dest);
    }
}
Collider.Field = makeEnumInts();
export class Unfamiliar extends Component {
    constructor() {
        super();
    }
    clone() {
        return new Unfamiliar();
    }
    copyTo(dest) {
        super.copyTo(dest);
    }
}
Unfamiliar.Field = makeEnumInts();
export class Solid extends Component {
    constructor() {
        super();
    }
    clone() {
        return new Solid();
    }
    copyTo(dest) {
        super.copyTo(dest);
    }
}
Solid.Field = makeEnumInts();
