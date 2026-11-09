import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Pillaged from '@civ-clone/core-tile-improvement/Rules/Pillaged';
export declare const getRules: (
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry
) => Pillaged[];
export default getRules;
