/* Import the namespace objects */
import {TerrainGenerators} from './terrain_generators.js';
import {EntityPrototypes} from './entity_prototypes.js';
import {Components} from './components.js';
import {Actions} from './actions.js';
import {Systems} from './systems.js';

/* Import names with which to populate namespaces */
import * as CoreComponent from './core_component.js';
import * as Position from './position.js';

import * as CoreEntityPrototype from './core_entity_prototype.js';

import * as StringTerrainGenerator from './string_terrain_generator.js';

import * as CoreAction from './core_action.js';

import * as Collision from './collision.js';
import * as Renderer from './renderer.js';
import * as Observation from './observation.js';

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

populateNamespace([StringTerrainGenerator], TerrainGenerators);
populateNamespace([CoreEntityPrototype], EntityPrototypes);
populateNamespace([CoreComponent, Position], Components);
populateNamespace([CoreAction], Actions);
populateNamespace([Collision, Renderer, Observation], Systems);
