import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import VisibilityChanged from '@civ-clone/core-player-world/Rules/Player/VisibilityChanged';
import { emitVisibilityChanged } from '@civ-clone/base-player/lib/events';

export const getRules = (
  engine: Engine = engineInstance
): VisibilityChanged[] => [
  new VisibilityChanged(
    'civ1-player:player/visibility-changed/emit',
    new Effect((tile: Tile, player: Player): void => {
      emitVisibilityChanged(tile, player, engine);
    })
  ),
];

export default getRules;
