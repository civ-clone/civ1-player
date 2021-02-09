import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  clientRegistry?: ClientRegistry
) => TurnStart[];
export default getRules;
