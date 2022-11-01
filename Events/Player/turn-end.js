"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TurnEnd_1 = require("@civ-clone/core-player/Rules/TurnEnd");
const getEvents = (currentPlayerRegistry = CurrentPlayerRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, engine = Engine_1.instance) => [
    [
        'player:turn-end',
        (player) => {
            currentPlayerRegistry.unregister(player);
            ruleRegistry.process(TurnEnd_1.default, player);
            const [nextPlayer] = currentPlayerRegistry.entries();
            if (!nextPlayer) {
                engine.emit('turn:end');
                return;
            }
            engine.emit('player:turn-start', nextPlayer);
        },
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=turn-end.js.map