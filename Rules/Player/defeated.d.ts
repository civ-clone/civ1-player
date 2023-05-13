import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
export declare const getRules: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  playerRegistry?: PlayerRegistry,
  ruleRegistry?: RuleRegistry,
  unitRegistry?: UnitRegistry,
  engine?: Engine
) => Defeated[];
export default getRules;
