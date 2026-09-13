"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const captured_1 = require("./Rules/City/captured");
const destroyed_1 = require("./Rules/City/destroyed");
const action_1 = require("./Rules/Player/action");
const added_1 = require("./Rules/Player/added");
const defeated_1 = require("./Rules/Player/defeated");
const spawn_1 = require("./Rules/Player/spawn");
const turn_start_1 = require("./Rules/Player/turn-start");
const visibility_changed_1 = require("./Rules/Player/visibility-changed");
const built_1 = require("./Rules/TileImprovement/built");
const destroyed_2 = require("./Rules/Unit/destroyed");
const visibility_1 = require("./Rules/Unit/visibility");
const built_2 = require("./Rules/World/built");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => game.rules.register(...(0, captured_1.default)(game.cities, game.rules), ...(0, destroyed_1.default)(game.cities, game.rules), ...(0, action_1.default)(), ...(0, added_1.default)(game.engine), ...(0, defeated_1.default)(game.currentPlayers, game.players, game.rules, game.units, game.engine), ...(0, spawn_1.default)(game.rules), ...(0, turn_start_1.default)(game.rules, game.cities, game.units), ...(0, visibility_changed_1.default)(game.engine), ...(0, built_1.default)(game.players, game.playerWorlds), ...(0, destroyed_2.default)(game.cities, game.rules), ...(0, visibility_1.default)(game.playerWorlds), ...(0, built_2.default)(game.civilizations, game.clients, game.engine, game.players, game.playerWorlds, game.rules, game.leaders, game.attributes, game.cityNames, game.traits));
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map