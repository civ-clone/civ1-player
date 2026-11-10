"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Pillaged_1 = require("@civ-clone/core-tile-improvement/Rules/Pillaged");
const updatePlayerTiles_1 = require("./lib/updatePlayerTiles");
// As for a built or removed improvement: each player who knows the tile sees its yields change
//  (civ-clone/web-renderer#413).
const getRules = (playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance) => [
    new Pillaged_1.default('civ1-player:tile-improvement/pillaged/update-player-tiles', (0, updatePlayerTiles_1.default)(playerRegistry, playerWorldRegistry)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pillaged.js.map