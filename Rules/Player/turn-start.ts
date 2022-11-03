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

export const getRules: (
  ruleRegistry?: RuleRegistry,
  cityRegistry?: CityRegistry,
  unitRegistry?: UnitRegistry
) => TurnStart[] = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): TurnStart[] => [
  new TurnStart(
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
          .forEach((cityYield: Yield) =>
            ruleRegistry.process(ProcessYield, cityYield, city, cityYields)
          );
      });
    })
  ),

  new TurnStart(
    new Effect((player: Player): void =>
      unitRegistry.getByPlayer(player).forEach((unit: Unit): void => {
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
