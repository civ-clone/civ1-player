import {
  CurrentPlayerRegistry,
  instance as currentPlayerRegistryInstance,
} from '@civ-clone/core-player/CurrentPlayerRegistry';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import Player from '@civ-clone/core-player/Player';

export const getEvents: (
  playerRegistry?: PlayerRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry
) => [string, (player: Player) => void][] = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance
): [string, (player: Player) => void][] => [
  [
    'player:defeated',
    (player: Player): void => {
      playerRegistry.unregister(player);
      currentPlayerRegistry.unregister(player);
    },
  ],
];

export default getEvents;
