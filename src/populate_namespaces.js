/* Import the namespace objects */
import {TerrainGenerators} from './terrain_generators.js';
import {EntityPrototypes} from './entity_prototypes.js';
import {Components} from './components.js';

/* Import names with which to populate namespaces */
import * as CoreComponent from './core_component.js';
import * as CoreEntityPrototype from './core_entity_prototype.js';

function populateNamespace(sources, dest) {
    let count = 0;

    for (let src of sources) {
        for (let name in src) {
            let exported = src[name];

            if (typeof exported === 'function') {
                exported.type = count;
                ++count;

                dest[name] = exported;
            }
        }
    }

    dest.length = count;
}

populateNamespace([], TerrainGenerators);
populateNamespace([CoreEntityPrototype], EntityPrototypes);
populateNamespace([CoreComponent], Components);
