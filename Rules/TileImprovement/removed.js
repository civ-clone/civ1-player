"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Removed_1 = require("@civ-clone/core-tile-improvement/Rules/Removed");
const updatePlayerTiles_1 = require("./lib/updatePlayerTiles");
// As for a built improvement: each player who knows the tile sees its yields change (civ-clone/web-renderer#32).
const getRules = (playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance) => [
    new Removed_1.default('civ1-player:tile-improvement/removed/update-player-tiles', (0, updatePlayerTiles_1.default)(playerRegistry, playerWorldRegistry)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=removed.js.map