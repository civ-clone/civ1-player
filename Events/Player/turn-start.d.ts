import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import Player from '@civ-clone/core-player/Player';
export declare const getEvents: (
  cityRegistry?: CityRegistry,
  clientRegistry?: ClientRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry,
  engine?: Engine,
  ruleRegistry?: RuleRegistry,
  unitRegistry?: UnitRegistry
) => [string, (player: Player) => void][];
export default getEvents;
