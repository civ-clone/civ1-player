import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Built from '@civ-clone/core-tile-improvement/Rules/Built';
export declare const getRules: (
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry
) => Built[];
export default getRules;
