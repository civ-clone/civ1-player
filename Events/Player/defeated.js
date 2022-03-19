"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const getEvents = (ruleRegistry = RuleRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, currentPlayerRegistry = CurrentPlayerRegistry_1.instance) => [
    [
        'player:defeated',
        (player) => {
            playerRegistry.unregister(player);
            currentPlayerRegistry.unregister(player);
        },
    ],
    // [
    //   'player:defeated',
    //   (player: Player): void => ruleRegistry.process(Defeated, player),
    // ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=defeated.js.map