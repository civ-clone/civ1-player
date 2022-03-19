import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
export declare const getEvents: (
  ruleRegistry?: RuleRegistry,
  playerRegistry?: PlayerRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry
) => [string, (player: Player) => void][];
export default getEvents;
