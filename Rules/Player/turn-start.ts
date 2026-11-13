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
import Effect from '@civ-clone/core-rule/Effect';
import Food from '@civ-clone/base-terrain-yield-food/Food';
import High from '@civ-clone/core-rule/Priorities/High';
import Player from '@civ-clone/core-player/Player';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import Trade from '@civ-clone/base-terrain-yield-trade/Trade';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import processCityYields from '@civ-clone/base-player/lib/processCityYields';
import resetUnits from '@civ-clone/base-player/lib/resetUnits';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): TurnStart[] => [
  new TurnStart(
    'civ1-player:player/turn-start/process-city-yields',
    new High(),
    new Effect((player: Player): void => {
      // Civilization's base yields, Food, Production and Trade, in that order. This will need to be
      // excluded/replaced/updated if the base yields change, but having a dynamic approach here causes the wrong values
      // to be processed.
      //
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
      processCityYields(
        player,
        [Food, Production, Trade],
        cityRegistry,
        ruleRegistry
      );
    })
  ),

  new TurnStart(
    'civ1-player:player/turn-start/reset-units',
    new Effect((player: Player): void => resetUnits(player, unitRegistry))
  ),
];

export default getRules;
