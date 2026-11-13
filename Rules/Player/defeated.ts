import {
  CurrentPlayerRegistry,
  instance as currentPlayerRegistryInstance,
} from '@civ-clone/core-player/CurrentPlayerRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import { destroyUnits } from '@civ-clone/base-player/lib/defeat';
import { emitDefeated } from '@civ-clone/base-player/lib/events';
import {
  isInGame,
  isStillToMove,
  leaveGame,
  stopMoving,
} from '@civ-clone/base-player/lib/leaveGame';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import {
  instance as ruleRegistryInstance,
  RuleRegistry,
} from '@civ-clone/core-rule/RuleRegistry';

export const getRules = (
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  engine: Engine = engineInstance
): Defeated[] => [
  new Defeated(
    'civ1-player:player/defeated/remove-current-player',
    new Criterion((player: Player) =>
      isStillToMove(player, currentPlayerRegistry)
    ),
    new Effect((player: Player) => stopMoving(player, currentPlayerRegistry))
  ),
  new Defeated(
    'civ1-player:player/defeated/unregister',
    new Criterion((player: Player) => isInGame(player, playerRegistry)),
    new Effect((player: Player) => leaveGame(player, playerRegistry))
  ),
  new Defeated(
    'civ1-player:player/defeated/destroy-units',
    new Effect((player: Player, defeatingPlayer: Player | null): void =>
      destroyUnits(player, defeatingPlayer, ruleRegistry, unitRegistry)
    )
  ),
  new Defeated(
    'civ1-player:player/defeated/emit',
    new Effect((player: Player, capturingPlayer: Player | null): void => {
      emitDefeated(player, capturingPlayer, engine);
    })
  ),
];

export default getRules;
