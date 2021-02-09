"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const getEvents = (ruleRegistry = RuleRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, currentPlayerRegistry = CurrentPlayerRegistry_1.instance, engine = Engine_1.instance) => [
    [
        'turn:start',
        () => {
            currentPlayerRegistry.register(...playerRegistry.entries());
            const [currentPlayer] = currentPlayerRegistry.entries();
            engine.emit('player:turn-start', currentPlayer);
        },
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=start.js.map