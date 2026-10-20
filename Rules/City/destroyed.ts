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
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import isDefeated from '../../lib/isDefeated';

export const getRules = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): Destroyed[] => [
  new Destroyed(
    'civ1-player:city/destroyed/defeat-when-last-city',
    new Criterion((destroyedCity: City): boolean =>
      isDefeated(
        destroyedCity.player(),
        cityRegistry,
        unitRegistry,
        clientRegistry,
        destroyedCity
      )
    ),
    new Effect((city: City, destroyingPlayer: Player | null) =>
      ruleRegistry.process(Defeated, city.player(), destroyingPlayer)
    )
  ),
];

export default getRules;
