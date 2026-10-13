import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
export declare const getRules: (
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry
) => Removed[];
export default getRules;
