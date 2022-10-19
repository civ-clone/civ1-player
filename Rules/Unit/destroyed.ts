import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Destroyed from '@civ-clone/core-unit/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Rule from '@civ-clone/core-rule/Rule';
import Unit from '@civ-clone/core-unit/Unit';

export const getRules: (
  cityRegistry?: CityRegistry,
  ruleRegistry?: RuleRegistry
) => Destroyed[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Destroyed[] => [
  new Rule(
    new Criterion(
      (unit: Unit, destroyingPlayer: Player | null) =>
        cityRegistry.getByPlayer(unit.player()).length === 0
      // TODO: check for "total annihilation" setting and check number of units
      // && unitRegistry.getByPlayer(unit.player()).length === 0
    ),
    new Effect((unit: Unit, destroyingPlayer: Player | null) =>
      ruleRegistry.process(Defeated, unit.player(), destroyingPlayer)
    )
  ),
];

export default getRules;
