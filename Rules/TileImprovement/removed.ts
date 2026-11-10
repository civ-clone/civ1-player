import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
import updatePlayerTiles from './lib/updatePlayerTiles';

// As for a built improvement: each player who knows the tile sees its yields change (civ-clone/web-renderer#32).
export const getRules = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Removed[] => [
  new Removed(
    'civ1-player:tile-improvement/removed/update-player-tiles',
    updatePlayerTiles(playerRegistry, playerWorldRegistry)
  ),
];

export default getRules;
