import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  clientRegistry?: ClientRegistry,
  cityRegistry?: CityRegistry,
  playerRegistry?: PlayerRegistry,
  unitRegistry?: UnitRegistry
) => TurnStart[];
export default getRules;
