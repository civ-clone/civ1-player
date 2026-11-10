import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
import updatePlayerTiles from './lib/updatePlayerTiles';

export const getRules = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Built[] => [
  new Built(
    'civ1-player:tile-improvement/built/update-player-tiles',
    updatePlayerTiles(playerRegistry, playerWorldRegistry)
  ),
];

export default getRules;
