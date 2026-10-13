import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
import Tile from '@civ-clone/core-world/Tile';

// As for a built improvement: each player who knows the tile sees its yields change (civ-clone/web-renderer#32).
export const getRules = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Removed[] => [
  new Removed(
    'civ1-player:tile-improvement/removed/update-player-tiles',
    new Effect((tile: Tile) => {
      tile.clearYieldCache(null);

      playerRegistry.forEach((player) => {
        const playerWorld = playerWorldRegistry.getByPlayer(player),
          playerTile = playerWorld.getByTile(tile);

        if (playerTile === null) {
          return;
        }

        tile.clearYieldCache(player);
      });
    })
  ),
];

export default getRules;
