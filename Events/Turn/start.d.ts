import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
export declare const getEvents: (
  playerRegistry?: PlayerRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry,
  engine?: Engine
) => [string, () => any][];
export default getEvents;
