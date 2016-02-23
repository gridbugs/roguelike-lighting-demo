import './populate_namespaces.js';

import {initGlobals} from './globals.js';

import {StringTerrainGenerator} from './string_terrain_generator.js';
import {Level} from './level.js';

import {Components} from './components.js';

import {assert} from './assert.js';


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
'&             #........#........#....................#   & @  &&',
'& &           #.................#....................+        &&',
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
    var firstLevel = new Level(generator);
    var playerCharacter = firstLevel.ecsContext.playerCharacter;

    var currentEcsContext;

    while (true) {
        currentEcsContext = playerCharacter.ecsContext;
        if (playerCharacter.get(Components.Health).value <= 0) {
            break;
        }
        await currentEcsContext.progressSchedule();
    }
    currentEcsContext.updatePlayer();
    console.debug('you died');
}
