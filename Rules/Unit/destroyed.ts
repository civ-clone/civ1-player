import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Destroyed from '@civ-clone/core-unit/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import isDefeated from '../../lib/isDefeated';
import Unit from '@civ-clone/core-unit/Unit';

export const getRules = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): Destroyed[] => [
  new Destroyed(
    'civ1-player:unit/destroyed/defeat-when-no-cities',
    new Criterion((unit: Unit): boolean =>
      isDefeated(
        unit.player(),
        cityRegistry,
        unitRegistry,
        clientRegistry,
        unit
      )
    ),
    new Effect((unit: Unit, destroyingPlayer: Player | null) =>
      ruleRegistry.process(Defeated, unit.player(), destroyingPlayer)
    )
  ),
];

export default getRules;
