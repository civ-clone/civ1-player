import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Captured from '@civ-clone/core-city/Rules/Captured';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';

export const getRules: (
  cityRegistry?: CityRegistry,
  ruleRegistry?: RuleRegistry
) => Captured[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Captured[] => [
  new Captured(
    // TODO: have some `Rule`s that just call `Player#defeated` or something?
    new Criterion(
      (
        capturedCity: City,
        capturingPlayer: Player,
        originalPlayer: Player
      ): boolean =>
        cityRegistry
          .getByPlayer(originalPlayer)
          .filter((city: City) => city !== capturedCity).length === 0
      // TODO: check for "total annihilation" setting and check number of units
      // && unitRegistry.getByPlayer(destroyedCity.player()).length === 0
    ),
    new Effect(
      (capturedCity: City, capturingPlayer: Player, player: Player): void => {
        ruleRegistry.process(Defeated, player, capturingPlayer);
      }
    )
  ),
];

export default getRules;
