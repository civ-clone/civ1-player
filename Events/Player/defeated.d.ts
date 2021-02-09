import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import Player from '@civ-clone/core-player/Player';
export declare const getEvents: (
  playerRegistry?: PlayerRegistry
) => [string, (player: Player) => void][];
export default getEvents;
