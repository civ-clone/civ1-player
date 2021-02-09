"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const getEvents = (playerRegistry = PlayerRegistry_1.instance) => [
    [
        'player:defeated',
        (player) => playerRegistry.unregister(player),
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=defeated.js.map