import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  cityRegistry?: CityRegistry,
  unitRegistry?: UnitRegistry
) => TurnStart[];
export default getRules;
