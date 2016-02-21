import './populate_namespaces.js';

import {initGlobals} from './globals.js';

import {GlobalDrawer} from './global_drawer.js';
import {Tiles} from './tiles.js';

import {StringTerrainGenerator} from './string_terrain_generator.js';
import {EcsContext} from './ecs_context.js';
import {KnowledgeRenderer} from './knowledge_renderer.js';
import {Collision} from './collision.js';
import {Observation} from './observation.js';

import {Components} from './components.js';
import {getChar} from './input.js';
import {assert} from './assert.js';

import {Line} from './line.js';
import {Vec2} from './vec2.js';

import {msDelay} from './time.js';
import {DoublyLinkedList} from './doubly_linked_list.js';
import {SearchQueue} from './search_queue.js';

export async function main() {
    await initGlobals();
    Math.seedrandom(0);

    var terrainStringArray = [
'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
'&                                               &             &&',
'&  &             &   &  &&               &                    &&',
'&   &      &         & &        ######################    &&  &&',
'&    &                          #....................#     && &&',
'&      &      ###################.c..................#      &&&&',
'&      &      #........#........#....................#        &&',
'& &   &       #........#........#....................#  &     &&',
'&             #........#........#....................#   &    &&',
'& &           #.................#...................@+        &&',
'&             #........#........#..>.................#      & &&',
'&     #############.####........#....................#   &    &&',
'&     #................#.............................#        &&',
'&   & #.........................#....................#        &&',
'&     #................#........#....................#  &     &&',
'&     #................#........#....................#        &&',
'&  &  +................#........#....................#  &     &&',
'&     #................#........#....................#      & &&',
'&  &  #................###############.###############        &&',
'&     #................#...................#                  &&',
'&     #................#...................#               &  &&',
'&     ##################...................#                  &&',
'&                      #...................#          &       &&',
'&   & &  &             #...................-      &       &   &&',
'&         &            #...................#       &  &   &   &&',
'&    &&  & &        &  #...................#        &         &&',
'&     &    &        &  #...................#              &   &&',
'&      &    &&&        #####################              &   &&',
'&                                                             &&',
'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
    ];

    var generator = new StringTerrainGenerator(terrainStringArray);
    var ecs = new EcsContext();

    generator.generate(ecs);

    (() => {
        for (let entity of ecs.entities) {
            if (entity.is(Components.PlayerCharacter)) {
                ecs.scheduleTurn(entity, 0);
            } else if (entity.is(Components.TurnTaker)) {
                ecs.scheduleTurn(entity, 1);
            }
        }
    })();

    while (true) {
        await ecs.progressSchedule();
    }
}
