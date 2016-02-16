import './populate_namespaces.js';

import {initGlobals} from './globals.js';

import {GlobalDrawer} from './global_drawer.js';
import {Tiles} from './tiles.js';

import {StringTerrainGenerator} from './string_terrain_generator.js';
import {EcsContext} from './ecs_context.js';

import {Systems} from './systems.js';

import {Components} from './components.js';
import {getChar} from './input.js';
import {assert} from './assert.js';

export async function main() {
    await initGlobals();
    Math.seedrandom(0);

    var terrainStringArray = [
'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
'&                                               &             &',
'&  &             &   &  &&               &                    &',
'&   &      &         & &        ######################    &&  &',
'&    &                          #....................#     && &',
'&      &      ###################....................#      &&&',
'&      &      #........#........#....................#        &',
'& &   &       #........#........#....................#  &     &',
'&             #........#........#....................#   &    &',
'& &           #.................#...................@+        &',
'&             #........#........#..>.................#      & &',
'&     #############.####........#....................#   &    &',
'&     #................#.............................#        &',
'&   & #.........................#....................#        &',
'&     #................#........#....................#  &     &',
'&     #................#........#....................#        &',
'&  &  +................#........#....................#  &     &',
'&     #................#........#....................#      & &',
'&  &  #................###############.###############        &',
'&     #................#...................#                  &',
'&     #................#...................#               &  &',
'&     ##################...................#                  &',
'&                      #...................#          &       &',
'&   & &  &             #...................-      &       &   &',
'&         &            #...................#       &  &   &   &',
'&    &&  & &        &  #...................#        &         &',
'&     &    &        &  #...................#              &   &',
'&      &    &&&        #####################              &   &',
'&                                                             &',
'&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
    ];

    var generator = new StringTerrainGenerator(terrainStringArray);
    var ecs = new EcsContext();

    generator.generate(ecs);

    (() => {
        for (let entity of ecs.entities) {
            if (entity.is(Components.TurnTaker)) {
                scheduleTurn(entity, 0);
            }
        }
    })();

    var renderer = new Systems.KnowledgeRenderer(ecs, GlobalDrawer.Drawer);
    var collision = new Systems.Collision(ecs);
    var observation = new Systems.Observation(ecs);

    function maybeApplyAction(action) {

        collision.run(action);

        if (action.success) {
            action.commit();
            return true;
        } else {
            return false;
        }
    }

    function scheduleTurn(entity, relativeTime) {
        assert(entity.is(Components.TurnTaker));

        let task = ecs.schedule.scheduleTask(async () => {
            if (!entity.is(Components.TurnTaker)) {
                return;
            }

            var turnTaker = entity.get(Components.TurnTaker);

            assert(turnTaker.nextTurn !== null);
            turnTaker.nextTurn = null;

            await takeTurn(entity);
        });

        entity.get(Components.TurnTaker).nextTurn = task;
    }

    async function takeTurn(entity) {

        if (entity.is(Components.Observer)) {
            observation.run(entity);
        }

        if (entity.is(Components.PlayerCharacter)) {
            renderer.run(entity);
        }

        var turn = await entity.get(Components.TurnTaker).takeTurn(entity);

        maybeApplyAction(turn.action);

        if (turn.reschedule) {
            scheduleTurn(entity, turn.time);
        }
    }

    async function progressSchedule() {
        await ecs.schedule.pop().task();
    }

    while (true) {
        await progressSchedule();
    }
}
