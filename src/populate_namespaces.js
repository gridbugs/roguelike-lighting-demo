/* Import the namespace objects */
import {TerrainGenerators} from 'terrain_generators';
import {EntityPrototypes} from 'entity_prototypes';
import {Components} from 'components';
import {Actions} from 'actions';

/* Import names with which to populate namespaces */
import * as CoreComponent from 'components/core_component';
import * as Position from 'components/position';
import * as Door from 'components/door';
import * as TurnTaker from 'components/turn_taker';
import * as StatComponent from 'components/stat_component';
import * as TileComponent from 'components/tile_component';

import * as CoreEntityPrototype from 'entities/core_entity_prototype';
import * as CharacterEntityPrototype from 'entities/character_entity_prototype';

import * as StringTerrainGenerator from 'string_terrain_generator';

import * as CoreAction from 'actions/core_action';

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
