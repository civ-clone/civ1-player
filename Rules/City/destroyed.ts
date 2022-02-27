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
      (city: City) => cityRegistry.getByPlayer(city.player()).length === 0
      // TODO: check for "total annihilation" setting and check number of units
      // && unitRegistry.getByPlayer(unit.player()).length === 0
    ),
    new Effect((city: City) => engine.emit('player:destroyed', city.player()))
  ),
];

export default getRules;
