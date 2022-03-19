import {
  CurrentPlayerRegistry,
  instance as currentPlayerRegistryInstance,
} from '@civ-clone/core-player/CurrentPlayerRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';

export const getEvents: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  engine?: Engine
) => [string, (player: Player) => void][] = (
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  engine: Engine = engineInstance
): [string, (player: Player) => void][] => [
  [
    'player:turn-end',
    (player: Player): void => {
      currentPlayerRegistry.unregister(player);

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
