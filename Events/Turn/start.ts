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
import Player from '@civ-clone/core-player/Player';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

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
      // The barbarians move first, as v474.05's slot 0 does (civ-clone/web-renderer#169), then everyone else in the
      //  order they joined.
      const players = playerRegistry.entries();

      currentPlayerRegistry.register(
        ...players.filter((player: Player): boolean => isBarbarian(player)),
        ...players.filter((player: Player): boolean => !isBarbarian(player))
      );

      const [currentPlayer] = currentPlayerRegistry.entries();

      engine.emit('player:turn-start', currentPlayer);
    },
  ],
];

export default getEvents;
