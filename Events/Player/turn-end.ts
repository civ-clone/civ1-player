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
import Player from '@civ-clone/core-player/Player';
import TurnEnd from '@civ-clone/core-player/Rules/TurnEnd';

export const getEvents: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => [string, (player: Player) => void][] = (
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  engine: Engine = engineInstance
): [string, (player: Player) => void][] => [
  [
    'player:turn-end',
    (player: Player): void => {
      currentPlayerRegistry.unregister(player);

      ruleRegistry.process(TurnEnd, player);

      const [nextPlayer] = currentPlayerRegistry.entries();

      if (!nextPlayer) {
        engine.emit('turn:end');

        return;
      }

      engine.emit('player:turn-start', nextPlayer);
    },
  ],
];

export default getEvents;
