import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Added from '@civ-clone/core-player/Rules/Added';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';

export const getRules: (engine?: Engine) => Added[] = (
  engine: Engine = engineInstance
): Added[] => [
  new Added(
    new Effect((player: Player): void => {
      engine.emit('player:added', player);
    })
  ),
];

export default getRules;
