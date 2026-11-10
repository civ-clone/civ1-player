import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Pillaged from '@civ-clone/core-tile-improvement/Rules/Pillaged';
import updatePlayerTiles from './lib/updatePlayerTiles';

// As for a built or removed improvement: each player who knows the tile sees its yields change
//  (civ-clone/web-renderer#413).
export const getRules = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Pillaged[] => [
  new Pillaged(
    'civ1-player:tile-improvement/pillaged/update-player-tiles',
    updatePlayerTiles(playerRegistry, playerWorldRegistry)
  ),
];

export default getRules;
