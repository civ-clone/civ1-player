"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Visibility_1 = require("@civ-clone/core-unit/Rules/Visibility");
const revealTile_1 = require("@civ-clone/base-player/lib/revealTile");
const getRules = (playerWorldRegistry = PlayerWorldRegistry_1.instance) => [
    new Visibility_1.default('civ1-player:unit/visibility/reveal-tile', new Effect_1.default((tile, player) => (0, revealTile_1.default)(tile, player, playerWorldRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=visibility.js.map