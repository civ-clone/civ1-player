import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
export declare const getRules: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  playerRegistry?: PlayerRegistry,
  engine?: Engine
) => Defeated[];
export default getRules;
