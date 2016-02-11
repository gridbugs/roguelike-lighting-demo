import './populate_namespaces.js';

import {Components} from './components.js';
import {InvalidatingComponentTable} from './invalidating_component_table.js';

export async function main() {
    var table = new InvalidatingComponentTable();

    var a = new Components.Position().init(1, 2);
    var b = new Components.Position().init(3, 4);

    a.blah = 123;

    console.debug(table);
    console.debug(table.get(Components.Position));

    table.add(a);

    var x = table.get(Components.Position);
    console.debug(x, x == a);

    table.remove(Components.Position);

    console.debug(table.get(Components.Position));

    table.add(b);
    var y = table.get(Components.Position);
    console.debug(y, x == y);

}
