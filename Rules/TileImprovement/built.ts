import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
import Effect from '@civ-clone/core-rule/Effect';
import Tile from '@civ-clone/core-world/Tile';

export const getRules = (
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Built[] => [
  new Built(
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
