import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
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
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';
import Unit from '@civ-clone/core-unit/Unit';

export const getRules = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance
): Destroyed[] => [
  new Destroyed(
    'civ1-player:unit/destroyed/defeat-when-no-cities',
    // Barbarians are never defeated (civ-clone/web-renderer#169).
    new Criterion((unit: Unit): boolean => !isBarbarian(unit.player())),
    new Criterion((unit: Unit): boolean =>
      isDefeated(
        unit.player(),
        cityRegistry,
        unitRegistry,
        clientRegistry,
        unit,
        true
      )
    ),
    new Effect((unit: Unit, destroyingPlayer: Player | null): void => {
      // Checked here rather than as a `Criterion`: every `Criterion` is evaluated before any `Effect` runs, and an
      //  earlier `Effect` of this same rule set can be what defeats the player. civ1-city disbands the units a
      //  captured or destroyed city supported, and when it was the player's last, the first of those to go defeats the
      //  player, taking the rest with it; defeating it again here brought another civilization back for each
      //  (civ-clone/web-renderer#600).
      if (!playerRegistry.includes(unit.player())) {
        return;
      }

      ruleRegistry.process(Defeated, unit.player(), destroyingPlayer);
    })
  ),
];

export default getRules;
