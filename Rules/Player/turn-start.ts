import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import TurnEnd from '@civ-clone/core-player/Rules/TurnEnd';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import {
  IProcessYieldRegistry,
  ProcessYield,
} from '@civ-clone/core-city/Rules/ProcessYield';
import City from '@civ-clone/core-city/City';
import Yield from '@civ-clone/core-yield/Yield';
import Unit from '@civ-clone/core-unit/Unit';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  instance as playerRegistryInstance,
  PlayerRegistry,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  instance as unitRegistryInstance,
  UnitRegistry,
} from '@civ-clone/core-unit/UnitRegistry';
import { Food, Production, Trade } from '@civ-clone/civ1-world/Yields';

export const getRules: (
  ruleRegistry?: RuleRegistry,
  clientRegistry?: ClientRegistry,
  cityRegistry?: CityRegistry,
  playerRegistry?: PlayerRegistry,
  unitRegistry?: UnitRegistry
) => TurnStart[] = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): TurnStart[] => [
  new TurnStart(
    new Effect((player: Player): void => {
      const rules = (ruleRegistry as IProcessYieldRegistry).get(ProcessYield);

      // process cities first in case units are created
      cityRegistry.getByPlayer(player).forEach((city: City): void => {
        const food = new Food(0, 'consolidated'),
          production = new Production(0, 'consolidated'),
          trade = new Trade(0, 'consolidated'),
          cityYields: Yield[] = [food, production, trade];

        city.yields().forEach((cityYield) => {
          if (cityYield instanceof Food) {
            food.add(cityYield);

            return;
          }

          if (cityYield instanceof Production) {
            production.add(cityYield);

            return;
          }

          if (cityYield instanceof Trade) {
            trade.add(cityYield);

            return;
          }

          cityYields.push(cityYield);
        });

        cityYields.forEach((cityYield: Yield) =>
          rules
            .filter((rule: ProcessYield): boolean =>
              rule.validate(cityYield, city, cityYields)
            )
            .forEach((rule: ProcessYield): void =>
              rule.process(cityYield, city, cityYields)
            )
        );
      });
    })
  ),

  new TurnStart(
    new Effect((player: Player): void =>
      unitRegistry.getByPlayer(player).forEach((unit: Unit): void => {
        unit.moves().set(unit.movement());

        const busyAction = unit.busy();

        if (busyAction) {
          if (!busyAction.validate()) {
            return;
          }

          busyAction.process();

          return;
        }

        unit.setActive();
        unit.setWaiting(false);
      })
    )
  ),
  new TurnStart(
    new Effect((player: Player): void => {
      clientRegistry
        .getByPlayer(player)
        .takeTurn()
        .then((): void => {
          ruleRegistry.process(TurnEnd, player);
        });
    })
  ),
];

export default getRules;
