"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefeated = void 0;
const Settlers_1 = require("@civ-clone/base-unit-settlers/Settlers");
const isHuman_1 = require("@civ-clone/civ1-difficulty/isHuman");
/**
 * Whether `player` is out of the game, leaving aside a city or unit that is going: a computer player once it has no
 * cities (v474.05 `StartGameMenu.cs` L644-716), and the human once they have no cities and no Settlers to found one
 * with (`GameEngine.cs` L111-120). Other units don't keep anyone in the game.
 */
const isDefeated = (player, cityRegistry, unitRegistry, clientRegistry, leaving = null) => cityRegistry.getByPlayer(player).every((city) => city === leaving) &&
    (!(0, isHuman_1.default)(player, clientRegistry) ||
        unitRegistry
            .getByPlayer(player)
            .every((unit) => unit === leaving || unit.destroyed() || !(unit instanceof Settlers_1.default)));
exports.isDefeated = isDefeated;
exports.default = exports.isDefeated;
//# sourceMappingURL=isDefeated.js.map