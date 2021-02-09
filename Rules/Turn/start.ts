import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  ProcessYield,
  IProcessYieldRegistry,
} from '@civ-clone/core-city/Rules/ProcessYield';
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
import Player from '@civ-clone/core-player/Player';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import Unit from '@civ-clone/core-unit/Unit';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  ruleRegistry?: RuleRegistry,
  cityRegistry?: CityRegistry,
  playerRegistry?: PlayerRegistry,
  unitRegistry?: UnitRegistry
) => Start[] = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): Start[] => [
  new Start(
    new Effect((): void => {
      const rules = (ruleRegistry as IProcessYieldRegistry).get(ProcessYield);

      playerRegistry.forEach((player: Player): void =>
        // process cities first in case units are created
        cityRegistry
          .getByPlayer(player)
          .forEach((city: City): void =>
            city
              .yields()
              .forEach((cityYield: Yield): void =>
                rules
                  .filter((rule: ProcessYield): boolean =>
                    rule.validate(cityYield, city)
                  )
                  .forEach((rule: ProcessYield): void =>
                    rule.process(cityYield, city)
                  )
              )
          )
      );
    })
  ),

  new Start(
    new Effect((): void =>
      playerRegistry.forEach((player: Player): void =>
        unitRegistry.getByPlayer(player).forEach((unit: Unit): void => {
          const busyAction = unit.busy();

          if (busyAction) {
            if (!busyAction.validate()) {
              return;
            }

            busyAction.process();
          }

          unit.setActive();
          unit.moves().set(unit.movement());
          unit.setWaiting(false);
        })
      )
    )
  ),
];

export default getRules;
