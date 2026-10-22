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
import Captured from '@civ-clone/core-city/Rules/Captured';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import isDefeated from '../../lib/isDefeated';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

export const getRules = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): Captured[] => [
  new Captured(
    'civ1-player:city/captured/defeat-when-last-city',
    // Barbarians are never defeated (civ-clone/web-renderer#169).
    new Criterion(
      (
        capturedCity: City,
        capturingPlayer: Player,
        originalPlayer: Player
      ): boolean => !isBarbarian(originalPlayer)
    ),
    new Criterion(
      (
        capturedCity: City,
        capturingPlayer: Player,
        originalPlayer: Player
      ): boolean =>
        isDefeated(
          originalPlayer,
          cityRegistry,
          unitRegistry,
          clientRegistry,
          capturedCity
        )
    ),
    new Effect(
      (capturedCity: City, capturingPlayer: Player, player: Player): void => {
        ruleRegistry.process(Defeated, player, capturingPlayer);
      }
    )
  ),
];

export default getRules;
