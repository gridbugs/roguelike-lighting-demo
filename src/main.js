import 'manual_types';
import 'populate_namespaces';

import {initConfigFromUrl} from 'options';
import {Config} from 'config';
import {initGlobals} from 'globals';

import {StringTerrainGenerator} from 'string_terrain_generator';
import {ShipGenerator} from 'ship_generator';

import {Level} from 'engine/level';
import {GameContext} from 'game_context';

import {Components} from 'components';

import {help} from 'control';
import {getKey} from 'utils/input';
import {msDelay} from 'utils/time';
import {assert} from 'utils/assert';

function initRng() {
    let seed;
    if (Config.RNG_SEED === null) {
        seed = Date.now();
    } else {
        seed = Config.RNG_SEED;
    }
    console.log(seed);
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
" #.........%.............z....%......%.................%......#",
" #.........##############=#####......###########=#######......#",
" #.........#                  #......#                 #......#",
" ###########                  #......#                 ########",
"                              #......#",
"                              #......#",
"                    #####=#####%%%%%+###########",
"                    #....@.............%.......#",
"                    #..................%.......#",
"                    =..................%.......#",
"                    #..................%.......#",
"                    #..................+.......#",
"                    #..................%.......#",
"                    #%%%%%%%%%%%+%%%%%%%%%%%%%%#",
"                    #..............%.......4123#",
"                    #..............%...........#",
"                    #..............%...........#",
"                    #........$.....+...........=",
"                    #..............%...........#",
"                    #..............%...........#",
"                    #..............%...........#",
"                    ############################",
""
    ];

    var first = false;              // XXX set this to true to enable help screen
    Level.EcsContext = GameContext;

    while (true) {

        var generator;
        if (Config.DEMO) {
            generator = new StringTerrainGenerator(1, terrainStringArrayL1, null);
        } else {
            generator = new ShipGenerator();
        }

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
                currentEcsContext.hud.message = "You died (press any key to restart)"
                break;
            }
            if (playerCharacter.has(Components.StuckInSpace)) {
                currentEcsContext.updatePlayer();
                currentEcsContext.hud.message = "You drift in space forever (press any key to restart)"
                break;
            }
            await currentEcsContext.progressSchedule();
        }

        await getKey();
        firstLevel.ecsContext.hud.showOverlay();

        /* This delay is necessary to prevent the compute-intensive level generator
         * delaying the displaying of the overlay. */
        await msDelay(30);

        currentEcsContext.hud.message = "";
    }
}
