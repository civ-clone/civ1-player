import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';

export const getEvents: (
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  ruleRegistry?: RuleRegistry
) => [string, (player: Player) => void][] = (
  clientRegistry: ClientRegistry = clientRegistryInstance,
  engine: Engine = engineInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): [string, (player: Player) => void][] => [
  [
    'player:turn-start',
    (player: Player): void => {
      ruleRegistry.process(TurnStart, player);

      const client = clientRegistry.getByPlayer(player);

      client
        .takeTurn()
        .catch((error) => console.error(error))
        .finally((): void => {
          engine.emit('player:turn-end', player);
        });
    },
  ],
];

export default getEvents;
