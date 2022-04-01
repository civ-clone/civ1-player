"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Built_1 = require("@civ-clone/core-tile-improvement/Rules/Built");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance) => [
    new Built_1.default(new Effect_1.default((tile) => {
        tile.clearYieldCache(null);
        playerRegistry.forEach((player) => {
            const playerWorld = playerWorldRegistry.getByPlayer(player), playerTile = playerWorld.getByTile(tile);
            if (playerTile === null) {
                return;
            }
            tile.clearYieldCache(player);
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map