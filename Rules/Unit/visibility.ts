import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import Visibility from '@civ-clone/core-unit/Rules/Visibility';
import revealTile from '@civ-clone/base-player/lib/revealTile';

export const getRules = (
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance
): Visibility[] => [
  new Visibility(
    'civ1-player:unit/visibility/reveal-tile',
    new Effect((tile: Tile, player: Player): void =>
      revealTile(tile, player, playerWorldRegistry)
    )
  ),
];

export default getRules;
