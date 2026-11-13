"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
const turns_1 = require("@civ-clone/base-player/lib/turns");
const getEvents = (playerRegistry = PlayerRegistry_1.instance, currentPlayerRegistry = CurrentPlayerRegistry_1.instance, engine = Engine_1.instance) => [
    [
        'turn:start',
        () => {
            // The barbarians move first, as v474.05's slot 0 does (civ-clone/web-renderer#169), then everyone else in the
            //  order they joined.
            const players = playerRegistry.entries();
            (0, turns_1.startTurn)([
                ...players.filter((player) => (0, isBarbarian_1.default)(player)),
                ...players.filter((player) => !(0, isBarbarian_1.default)(player)),
            ], currentPlayerRegistry, engine);
        },
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=start.js.map