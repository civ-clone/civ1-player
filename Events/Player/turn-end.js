"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const getEvents = (currentPlayerRegistry = CurrentPlayerRegistry_1.instance, engine = Engine_1.instance) => [
    [
        'player:turn-end',
        (player) => {
            currentPlayerRegistry.unregister(player);
            const [nextPlayer] = currentPlayerRegistry.entries();
            if (nextPlayer) {
                engine.emit('player:turn-start', nextPlayer);
            }
            else {
                engine.emit('turn:end');
            }
        },
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=turn-end.js.map