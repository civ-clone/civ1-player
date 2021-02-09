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
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TurnStart,
  ITurnStartRegistry,
} from '@civ-clone/core-player/Rules/TurnStart';
import Player from '@civ-clone/core-player/Player';

export const getEvents: (
  clientRegistry?: ClientRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry,
  engine?: Engine,
  ruleRegistry?: RuleRegistry
) => [string, (player: Player) => void][] = (
  clientRegistry: ClientRegistry = clientRegistryInstance,
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  engine: Engine = engineInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
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
];

export default getEvents;
