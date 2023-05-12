import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import VisibilityChanged from '@civ-clone/core-player-world/Rules/Player/VisibilityChanged';

export const getRules = (
  engine: Engine = engineInstance
): VisibilityChanged[] => [
  new VisibilityChanged(
    new Effect((tile: Tile, player: Player): void => {
      engine.emit('player:visibility-changed', tile, player);
    })
  ),
];

export default getRules;
