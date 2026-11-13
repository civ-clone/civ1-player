"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const turns_1 = require("@civ-clone/base-player/lib/turns");
const getEvents = (currentPlayerRegistry = CurrentPlayerRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, engine = Engine_1.instance) => [
    [
        'player:turn-end',
        (player) => {
            (0, turns_1.endPlayerTurn)(player, currentPlayerRegistry, ruleRegistry, engine);
        },
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=turn-end.js.map