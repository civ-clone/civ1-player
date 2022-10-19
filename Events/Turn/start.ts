import {
  CurrentPlayerRegistry,
  instance as currentPlayerRegistryInstance,
} from '@civ-clone/core-player/CurrentPlayerRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';

export const getEvents: (
  playerRegistry?: PlayerRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry,
  engine?: Engine
) => [string, () => any][] = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  engine: Engine = engineInstance
): [string, () => any][] => [
  [
    'turn:start',
    (): void => {
      currentPlayerRegistry.register(...playerRegistry.entries());

      const [currentPlayer] = currentPlayerRegistry.entries();

      engine.emit('player:turn-start', currentPlayer);
    },
  ],
];

export default getEvents;
