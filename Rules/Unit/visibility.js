"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Visibility_1 = require("@civ-clone/core-unit/Rules/Visibility");
const getRules = (playerWorldRegistry = PlayerWorldRegistry_1.instance) => [
    new Visibility_1.default(new Effect_1.default((tile, player) => {
        tile.clearYieldCache(player);
        const playerWorld = playerWorldRegistry.getByPlayer(player);
        playerWorld.register(tile);
        const playerTile = playerWorld.getByTile(tile);
        playerTile.update();
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=visibility.js.map