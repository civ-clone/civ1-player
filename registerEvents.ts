import { Game, defaultGame } from '@civ-clone/core-game';
import playerTurnEnd from './Events/Player/turn-end';
import playerTurnStart from './Events/Player/turn-start';
import turnStart from './Events/Turn/start';

export const registerEvents = (game: Game): void =>
  [
    ...playerTurnEnd(game.currentPlayers, game.rules, game.engine),
    ...playerTurnStart(game.clients, game.engine, game.rules),
    ...turnStart(game.players, game.currentPlayers, game.engine),
  ].forEach(([event, handler]) => game.engine.on(event, handler));

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game whose players never
// take a turn — and, as with the rules, nothing saying so.
registerEvents(defaultGame);

export default registerEvents;
