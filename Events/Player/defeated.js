"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const getEvents = (playerRegistry = PlayerRegistry_1.instance, currentPlayerRegistry = CurrentPlayerRegistry_1.instance) => [
    [
        'player:defeated',
        (player) => {
            playerRegistry.unregister(player);
            currentPlayerRegistry.unregister(player);
        },
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=defeated.js.map