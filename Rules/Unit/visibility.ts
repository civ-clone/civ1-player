import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import Visibility from '@civ-clone/core-unit/Rules/Visibility';
import Effect from '@civ-clone/core-rule/Effect';

export const getRules: (
  playerWorldRegistry?: PlayerWorldRegistry
) => Visibility[] = (
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Visibility[] => [
  new Visibility(
    new Criterion(
      (tile: Tile, player: Player) =>
        !playerWorldRegistry.getByPlayer(player).includes(tile)
    ),
    new Effect((tile: Tile, player: Player) => {
      tile.clearYieldCache(player);

      playerWorldRegistry.getByPlayer(player).register(tile);
    })
  ),
];

export default getRules;
