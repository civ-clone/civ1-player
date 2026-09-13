"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEvents = void 0;
const core_game_1 = require("@civ-clone/core-game");
const turn_end_1 = require("./Events/Player/turn-end");
const turn_start_1 = require("./Events/Player/turn-start");
const start_1 = require("./Events/Turn/start");
const registerEvents = (game) => [
    ...(0, turn_end_1.default)(game.currentPlayers, game.rules, game.engine),
    ...(0, turn_start_1.default)(game.clients, game.engine, game.rules),
    ...(0, start_1.default)(game.players, game.currentPlayers, game.engine),
].forEach(([event, handler]) => game.engine.on(event, handler));
exports.registerEvents = registerEvents;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game whose players never
// take a turn — and, as with the rules, nothing saying so.
(0, exports.registerEvents)(core_game_1.defaultGame);
exports.default = exports.registerEvents;
//# sourceMappingURL=registerEvents.js.map