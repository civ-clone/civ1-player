"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Built_1 = require("@civ-clone/core-tile-improvement/Rules/Built");
const updatePlayerTiles_1 = require("./lib/updatePlayerTiles");
const getRules = (playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance) => [
    new Built_1.default('civ1-player:tile-improvement/built/update-player-tiles', (0, updatePlayerTiles_1.default)(playerRegistry, playerWorldRegistry)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map