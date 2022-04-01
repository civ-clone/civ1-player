"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Visibility_1 = require("@civ-clone/core-unit/Rules/Visibility");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (playerWorldRegistry = PlayerWorldRegistry_1.instance) => [
    new Visibility_1.default(new Criterion_1.default((tile, player) => !playerWorldRegistry.getByPlayer(player).includes(tile)), new Effect_1.default((tile, player) => {
        tile.clearYieldCache(player);
        playerWorldRegistry.getByPlayer(player).register(tile);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=visibility.js.map