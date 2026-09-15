import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import Visibility from '@civ-clone/core-unit/Rules/Visibility';

export const getRules = (
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Visibility[] => [
  new Visibility(
    new Effect((tile: Tile, player: Player) => {
      tile.clearYieldCache(player);

      const playerWorld = playerWorldRegistry.getByPlayer(player);

      playerWorld.register(tile);

      const playerTile = playerWorld.getByTile(tile)!;

      playerTile.update();
    })
  ),
];

export default getRules;
