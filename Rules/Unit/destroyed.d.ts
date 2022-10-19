import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Destroyed from '@civ-clone/core-unit/Rules/Destroyed';
export declare const getRules: (
  cityRegistry?: CityRegistry,
  ruleRegistry?: RuleRegistry
) => Destroyed[];
export default getRules;
