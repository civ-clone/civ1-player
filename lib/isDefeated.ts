import City from '@civ-clone/core-city/City';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import Player from '@civ-clone/core-player/Player';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Unit from '@civ-clone/core-unit/Unit';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import isHuman from '@civ-clone/civ1-difficulty/isHuman';

/**
 * Whether `player` is out of the game, leaving aside a city or unit that is going: a computer player once it has no
 * cities (v474.05 `StartGameMenu.cs` L644-716), and the human once they have no cities and no Settlers to found one
 * with (`GameEngine.cs` L111-120). Other units don't keep anyone in the game.
 */
export const isDefeated = (
  player: Player,
  cityRegistry: CityRegistry,
  unitRegistry: UnitRegistry,
  clientRegistry: ClientRegistry,
  leaving: City | Unit | null = null
): boolean =>
  cityRegistry.getByPlayer(player).every((city: City) => city === leaving) &&
  (!isHuman(player, clientRegistry) ||
    unitRegistry
      .getByPlayer(player)
      .every(
        (unit: Unit): boolean =>
          unit === leaving || unit.destroyed() || !(unit instanceof Settlers)
      ));

export default isDefeated;
