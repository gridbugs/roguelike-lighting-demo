/* Import the namespace objects */
import {TerrainGenerators} from 'terrain_generators.js';
import {EntityPrototypes} from 'entity_prototypes.js';
import {Components} from 'components.js';
import {Actions} from 'actions.js';

/* Import names with which to populate namespaces */
import * as CoreComponent from 'components/core_component.js';
import * as Position from 'components/position.js';
import * as Door from 'components/door.js';
import * as TurnTaker from 'components/turn_taker.js';
import * as StatComponent from 'components/stat_component.js';
import * as TileComponent from 'components/tile_component.js';

import * as CoreEntityPrototype from 'entities/core_entity_prototype.js';
import * as CharacterEntityPrototype from 'entities/character_entity_prototype.js';

import * as StringTerrainGenerator from 'string_terrain_generator.js';

import * as CoreAction from 'actions/core_action.js';

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
populateNamespace([CoreEntityPrototype, CharacterEntityPrototype], EntityPrototypes);
populateNamespace([CoreComponent, Position, Door, TurnTaker, StatComponent, TileComponent], Components);
populateNamespace([CoreAction], Actions);
