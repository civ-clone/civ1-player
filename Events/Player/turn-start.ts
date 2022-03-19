import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  CurrentPlayerRegistry,
  instance as currentPlayerRegistryInstance,
} from '@civ-clone/core-player/CurrentPlayerRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  IProcessYieldRegistry,
  ProcessYield,
} from '@civ-clone/core-city/Rules/ProcessYield';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TurnStart,
  ITurnStartRegistry,
} from '@civ-clone/core-player/Rules/TurnStart';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import City from '@civ-clone/core-city/City';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import Yield from '@civ-clone/core-yield/Yield';

export const getEvents: (
  cityRegistry?: CityRegistry,
  clientRegistry?: ClientRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry,
  engine?: Engine,
  ruleRegistry?: RuleRegistry,
  unitRegistry?: UnitRegistry
) => [string, (player: Player) => void][] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  engine: Engine = engineInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): [string, (player: Player) => void][] => [
  [
    'player:turn-start',
    (player: Player): void => {
      (ruleRegistry as ITurnStartRegistry).process(TurnStart, player);

      const client = clientRegistry.getByPlayer(player);

      client.takeTurn().then((): void => {
        engine.emit('player:turn-end', player);
      });
    },
  ],
  [
    'player:turn-start',
    (player: Player): void => {
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
    },
  ],
  [
    'player:turn-start',
    (player: Player): void =>
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
      }),
  ],
];

export default getEvents;
