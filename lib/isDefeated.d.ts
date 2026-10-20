import City from '@civ-clone/core-city/City';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
/**
 * Whether `player` is out of the game, leaving aside a city or unit that is going. Losing a city, a computer player is
 * out once it has no cities (v474.05 `StartGameMenu.cs` L644-716, checked after every capture), and the human once they
 * have no cities and no Settlers to found one with (`GameEngine.cs` L111-120). Losing a unit (`settlersKeepAlive`), a
 * player with no cities is out only once it has no Settlers either, so a computer player that hasn't founded its first
 * city yet isn't destroyed with the first unit it loses. Other units don't keep anyone in the game.
 */
export declare const isDefeated: (
  player: Player,
  cityRegistry: CityRegistry,
  unitRegistry: UnitRegistry,
  clientRegistry: ClientRegistry,
  leaving?: City | Unit | null,
  settlersKeepAlive?: boolean
) => boolean;
export default isDefeated;
