import 'manual_types';
import 'populate_namespaces';

import {initConfigFromUrl} from 'options';
import {Config} from 'config';
import {initGlobals} from 'globals';

import {StringTerrainGenerator} from 'string_terrain_generator';
import {ConwayTerrainGenerator} from 'conway_terrain_generator';

import {Level} from 'engine/level';
import {GameContext} from 'game_context';

import {Components} from 'components';

import {help} from 'control';
import {getKey} from 'utils/input';
import {assert} from 'utils/assert';

function initRng() {
    let seed;
    if (Config.RNG_SEED === null) {
        seed = Date.now();
    } else {
        seed = Config.RNG_SEED;
    }
    console.debug(seed);
    Math.seedrandom(seed);
}

export async function main() {
    initConfigFromUrl();
    initRng();

    await initGlobals();

    var terrainStringArrayL1 = [
"",
"                      ########################",
"                      #......................#",
"                      #......................#",
"                      #......................#",
"                      #......................#",
"                      #......................#",
"                      #......................#",
"                      #########+%%%%%#########",
"                              #......#",
"                              #......#",
" ###########                  #......#",
" #.........#                  #......#                 ########",
" #.........####################......########=##########......#",
" #.........%..................%......%.................%......#",
" #.........+..................+......+.................+......#",
" #.........%..................%......%.................%......#",
" #.........##############=#####......###########=#######......#",
" #.........#                  #......#                 #......#",
" ###########                  #......#                 ########",
"                              #......#",
"                              #......#",
"                    #####=#####%%%%%+###########",
"                    #..................%.......#",
"                    #..................%.......#",
"                    =..................%.......#",
"                    #..................%.......#",
"                    #..................+.......#",
"                    #..................%.......#",
"                    #%%%%%%%%%%%+%%%%%%%%%%%%%%#",
"                    #..............%.....@.4123#",
"                    #..............%...........#",
"                    #..............%...........#",
"                    #..............+...........=",
"                    #..............%...........#",
"                    #..............%...........#",
"                    #..............%.....z.....#",
"                    ############################",
""
    ];

    var first = false;              // XXX set this to true to enable help screen
    Level.EcsContext = GameContext;

    while (true) {
        var generator = new StringTerrainGenerator(1, terrainStringArrayL1, null);
        var firstLevel = new Level(generator);
        var playerCharacter = firstLevel.ecsContext.playerCharacter;

        if (first) {
            first = false;
            await help(playerCharacter);
        }

        firstLevel.ecsContext.hud.hideOverlay();

        var currentEcsContext;
        while (true) {
            currentEcsContext = playerCharacter.ecsContext;
            if (playerCharacter.get(Components.Health).value <= 0) {
                currentEcsContext.updatePlayer();
                currentEcsContext.hud.message = "You died"
                break;
            }
            if (playerCharacter.has(Components.StuckInSpace)) {
                currentEcsContext.updatePlayer();
                currentEcsContext.hud.message = "You drift in space forever"
                break;
            }
            await currentEcsContext.progressSchedule();
        }


        await getKey();

        currentEcsContext.hud.message = "";
    }
}
