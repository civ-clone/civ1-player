import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';

export const getRules: (
  cityRegistry?: CityRegistry,
  ruleRegistry?: RuleRegistry
) => Destroyed[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Destroyed[] => [
  new Destroyed(
    new Criterion(
      (destroyedCity: City, destroyingPlayer: Player | null): boolean =>
        cityRegistry
          .getByPlayer(destroyedCity.player())
          .filter((city: City) => city !== destroyedCity).length === 0
      // TODO: check for "total annihilation" setting and check number of units
      // && unitRegistry.getByPlayer(destroyedCity.player()).length === 0
    ),
    new Effect((city: City, destroyingPlayer: Player | null) =>
      ruleRegistry.process(Defeated, city.player(), destroyingPlayer)
    )
  ),
];

export default getRules;
