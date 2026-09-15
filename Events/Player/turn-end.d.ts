import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
export declare const getEvents: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => [string, (player: Player) => void][];
export default getEvents;
