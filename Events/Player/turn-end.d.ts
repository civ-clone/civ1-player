import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
export declare const getEvents: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  engine?: Engine
) => [string, (player: Player) => void][];
export default getEvents;
