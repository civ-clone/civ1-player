import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import TurnEnd from '@civ-clone/core-player/Rules/TurnEnd';
export declare const getRules: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => TurnEnd[];
export default getRules;
