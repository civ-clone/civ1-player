"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefeated = void 0;
const FoundsCities_1 = require("@civ-clone/base-unit-trait-founds-cities/FoundsCities");
const isDefeated_1 = require("@civ-clone/base-player/lib/isDefeated");
const isHuman_1 = require("@civ-clone/civ1-difficulty/isHuman");
/**
 * Whether `player` is out of the game, leaving aside a city or unit that is going. Losing a city, a computer player is
 * out once it has no cities (v474.05 `StartGameMenu.cs` L644-716, checked after every capture), and the human once they
 * have no cities and no Settlers to found one with (`GameEngine.cs` L111-120). Losing a unit (`settlersKeepAlive`), a
 * player with no cities is out only once it has no Settlers either, so a computer player that hasn't founded its first
 * city yet isn't destroyed with the first unit it loses. Other units don't keep anyone in the game. Settlers are the units
 * that `FoundsCities`, asked of each unit, so of its own game's rules.
 */
const isDefeated = (player, cityRegistry, unitRegistry, clientRegistry, leaving = null, settlersKeepAlive = (0, isHuman_1.default)(player, clientRegistry)) => (0, isDefeated_1.default)(player, cityRegistry, unitRegistry, leaving, settlersKeepAlive
    ? (unit) => unit.hasTrait(FoundsCities_1.default)
    : null);
exports.isDefeated = isDefeated;
exports.default = exports.isDefeated;
//# sourceMappingURL=isDefeated.js.map