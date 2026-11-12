import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import Food from '@civ-clone/base-terrain-yield-food/Food';
import High from '@civ-clone/core-rule/Priorities/High';
import Player from '@civ-clone/core-player/Player';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import Trade from '@civ-clone/base-terrain-yield-trade/Trade';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import Unit from '@civ-clone/core-unit/Unit';
import Yield from '@civ-clone/core-yield/Yield';
import { reduceYields } from '@civ-clone/core-yield/lib/reduceYields';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): TurnStart[] => [
  new TurnStart(
    'civ1-player:player/turn-start/process-city-yields',
    new High(),
    new Effect((player: Player): void => {
      // This will need to be excluded/replaced/updated if the base yields change, but having a dynamic approach here
      // causes the wrong values to be processed.
      cityRegistry.getByPlayer(player).forEach((city: City): void => {
        const cityYields = city.yields();

        reduceYields(cityYields, Food, Production, Trade)
          .reduce(
            (yields: Yield[], yieldValue, index) => {
              yields[index].set(yieldValue, 'Consolidated');

              return yields;
            },
            [
              new Food(0, 'Consolidated'),
              new Production(0, 'Consolidated'),
              new Trade(0, 'Consolidated'),
            ]
          )
          .forEach((cityYield: Yield): void => {
            // Once the city is gone, none of the rest of its yields are processed: a city that starves away on its
            //  food completes nothing on its shields, and its shields and trade go with it
            //  (civ-clone/web-renderer#975). Nothing completing in it also means no Wonder is ever registered as
            //  standing in a city that no longer exists.
            //
            // v474.05 `city_process` (`CITYMGT.C`) leaves a city it destroys at once, `goto label_exit;` skipping
            //  everything after, as when its Settlers empty it (598-604):
            //
            //  ```c
            //  if (--townbuf[city].size == 0) {
            //      vanish(city, townbuf[city].x, townbuf[city].y);
            //      ...
            //      goto label_exit;
            //  ```
            //
            //  It starves a city one pass later than this does, though: the turn's food is added to the box with the
            //  shields (573-582: `townbuf[city].food_box += town_res_sums[0] - townbuf[city].size * 2 - ...;`,
            //  then `townbuf[city].shield_box += scratch_i;` and the build is checked), and only a box left below
            //  zero is resolved, at the start of the city's next pass, before anything else is worked out (287-313:
            //  `if (townbuf[city].food_box < 0) { ... if (--townbuf[city].size == 0) { vanish(...); ...
            //  goto label_exit; }`). So the original completes the dying turn's build and then loses the city; here
            //  the city is lost on the turn its food runs out, and that turn's build isn't completed.
            if (city.destroyed()) {
              return;
            }

            ruleRegistry.process(ProcessYield, cityYield, city, cityYields);
          });
      });
    })
  ),

  new TurnStart(
    'civ1-player:player/turn-start/reset-units',
    new Effect((player: Player): void =>
      unitRegistry.getByPlayer(player).forEach((unit: Unit): void => {
        if (unit.destroyed()) {
          return;
        }

        unit.moves().set(unit.movement());

        const busyAction = unit.busy();

        if (!busyAction) {
          unit.setActive();
          unit.setWaiting(false);

          return;
        }

        if (!busyAction.validate()) {
          return;
        }

        busyAction.process();
        // It's the job of the `DelayedAction` to set the `Unit` as active, otherwise `Action`s that chain `Busy` will
        // end up being cleared here.
      })
    )
  ),
];

export default getRules;
