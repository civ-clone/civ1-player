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
      clientRegistry
        .getByPlayer(player)
        .takeTurn()
        .then((): void => {
          ruleRegistry.process(TurnEnd, player);
        });
    })
  ),
  new TurnStart(
    new Effect((player: Player): void => {
      const rules = (ruleRegistry as IProcessYieldRegistry).get(ProcessYield);

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
        );
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
];

export default getRules;
