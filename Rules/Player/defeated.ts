import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';

export const getRules: (engine?: Engine) => Defeated[] = (
  engine: Engine = engineInstance
): Defeated[] => [
  new Defeated(
    new Effect((player: Player, capturingPlayer: Player | null): void => {
      engine.emit('player:defeated', player, capturingPlayer);
    })
  ),
];

export default getRules;
