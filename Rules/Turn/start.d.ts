import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  cityRegistry?: CityRegistry,
  playerRegistry?: PlayerRegistry,
  unitRegistry?: UnitRegistry
) => Start[];
export default getRules;
