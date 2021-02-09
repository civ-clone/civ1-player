import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import Player from '@civ-clone/core-player/Player';

export const getEvents: (
  playerRegistry?: PlayerRegistry
) => [string, (player: Player) => void][] = (
  playerRegistry: PlayerRegistry = playerRegistryInstance
): [string, (player: Player) => void][] => [
  [
    'player:defeated',
    (player: Player): void => playerRegistry.unregister(player),
  ],
];

export default getEvents;
