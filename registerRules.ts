import cityCaptured from './Rules/City/captured';
import cityDestroyed from './Rules/City/destroyed';
import playerAction from './Rules/Player/action';
import playerAdded from './Rules/Player/added';
import playerDefeated from './Rules/Player/defeated';
import playerSpawn from './Rules/Player/spawn';
import playerTurnStart from './Rules/Player/turn-start';
import playerVisibilityChanged from './Rules/Player/visibility-changed';
import tileImprovementBuilt from './Rules/TileImprovement/built';
import unitDestroyed from './Rules/Unit/destroyed';
import unitVisibility from './Rules/Unit/visibility';
import worldBuilt from './Rules/World/built';
import { Game, defaultGame } from '@civ-clone/core-game';

export const register = (game: Game): void =>
  game.rules.register(
    ...cityCaptured(game.cities, game.rules),
    ...cityDestroyed(game.cities, game.rules),
    ...playerAction(),
    ...playerAdded(game.engine),
    ...playerDefeated(
      game.currentPlayers,
      game.players,
      game.rules,
      game.units,
      game.engine
    ),
    ...playerSpawn(game.rules),
    ...playerTurnStart(game.rules, game.cities, game.units),
    ...playerVisibilityChanged(game.engine),
    ...tileImprovementBuilt(game.players, game.playerWorlds),
    ...unitDestroyed(game.cities, game.rules),
    ...unitVisibility(game.playerWorlds),
    ...worldBuilt(
      game.civilizations,
      game.clients,
      game.engine,
      game.players,
      game.playerWorlds,
      game.rules,
      game.leaders,
      game.attributes,
      game.cityNames,
      game.traits
    )
  );

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
