import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
export declare const getRules: (
  cityRegistry?: CityRegistry,
  ruleRegistry?: RuleRegistry,
  unitRegistry?: UnitRegistry,
  clientRegistry?: ClientRegistry
) => Destroyed[];
export default getRules;
