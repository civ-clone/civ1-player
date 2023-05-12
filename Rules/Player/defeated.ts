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
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';

export const getRules = (
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance,
  engine: Engine = engineInstance
): Defeated[] => [
  new Defeated(
    new Criterion((player: Player) => currentPlayerRegistry.includes(player)),
    new Effect((player: Player) => currentPlayerRegistry.unregister(player))
  ),
  new Defeated(
    new Criterion((player: Player) => playerRegistry.includes(player)),
    new Effect((player: Player) => playerRegistry.unregister(player))
  ),
  new Defeated(
    new Effect((player: Player, defeatingPlayer: Player | null) =>
      unitRegistry
        .getByPlayer(player)
        .forEach((unit) => unit.destroy(defeatingPlayer))
    )
  ),
  new Defeated(
    new Effect((player: Player, capturingPlayer: Player | null): void => {
      engine.emit('player:defeated', player, capturingPlayer);
    })
  ),
];

export default getRules;
