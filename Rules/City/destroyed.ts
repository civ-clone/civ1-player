import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';
import Rule from '@civ-clone/core-rule/Rule';
import Player from '@civ-clone/core-player/Player';

export const getRules: (
  cityRegistry?: CityRegistry,
  engine?: Engine,
  unitRegistry?: UnitRegistry
) => Destroyed[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  engine: Engine = engineInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): Destroyed[] => [
  new Rule(
    new Criterion(
      (destroyedCity: City, player: Player | null): boolean =>
        cityRegistry
          .getByPlayer(destroyedCity.player())
          .filter((city: City) => city !== destroyedCity).length === 0
      // TODO: check for "total annihilation" setting and check number of units
      // && unitRegistry.getByPlayer(destroyedCity.player()).length === 0
    ),
    new Effect((city: City, player: Player | null) =>
      engine.emit('player:defeated', city.player(), player)
    )
  ),
];

export default getRules;
