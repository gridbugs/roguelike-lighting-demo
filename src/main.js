import 'manual_types';
import 'populate_namespaces';

import {initConfigFromUrl} from 'options';
import {Config} from 'config';
import {initGlobals} from 'globals';
import {GlobalHud} from 'global_hud';

import {StringTerrainGenerator} from 'string_terrain_generator';
import {ShipGenerator} from 'ship_generator';

import {Level} from 'engine/level';
import {GameContext} from 'game_context';

import {Components} from 'components';

import {help} from 'control';
import {getKey} from 'utils/input';
import {msDelay} from 'utils/time';
import {assert} from 'utils/assert';

import {HelpText} from 'help_text';

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

const LOADING_SCREEN = [
    'Loading...Generating...',
    '',
    ''
]
.concat(HelpText)
.map((x) => {return `<p>${x}</p>`})
.join('<br/>');

const LOADED_SCREEN = [
    'Loading...Generating...<span style="color:green">Done</span>',
    '',
    ''
]
.concat(HelpText).concat([
    '',
    '<span style="color:red">Press any key to start</start>'
])
.map((x) => {return `<p>${x}</p>`})
.join('<br/>');


export async function main() {
    initConfigFromUrl();
    initRng();

    await initGlobals();

    var terrainStringArrayL1 = [
"",
"                      #############=##########",
"                      #...........@..........#",
"                      #......................#",
"                      #......................#",
"                      #......................#",
"                      #......................#",
"                      #......................#",
"                      #########%%%.%%#########",
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
"                    #..............%.......4123#",
"                    #..............%...........#",
"                    #..............%...........#",
"                    #........$.....+...........=",
"                    #..............%...........#",
"                    #..............%...........#",
"                    #..............%...........#",
"                    ######=#####################",
""
    ];

    var first = true;
    Level.EcsContext = GameContext;
    let hud = GlobalHud.Hud;

    while (true) {
        hud.overlay = LOADING_SCREEN;
        hud.showOverlay();
        await msDelay(30);

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
            hud.overlay = LOADED_SCREEN;
            await getKey();
        }

        firstLevel.ecsContext.hud.hideOverlay();

        var currentEcsContext;
        while (true) {
            currentEcsContext = playerCharacter.ecsContext;
            if (playerCharacter.get(Components.Health).value <= 0) {
                currentEcsContext.updatePlayer();
                currentEcsContext.drawer.fill('rgba(255, 0, 0, 0.25)');
                currentEcsContext.hud.message = "You died (press any key to restart)"
                break;
            }
            if (playerCharacter.has(Components.StuckInSpace)) {
                currentEcsContext.updatePlayer();
                currentEcsContext.drawer.fill('rgba(255, 0, 0, 0.25)');
                currentEcsContext.hud.message = "You drift in space forever (press any key to restart)"
                break;
            }
            await currentEcsContext.progressSchedule();
        }

        await getKey();

        currentEcsContext.hud.message = "";
   }
}
