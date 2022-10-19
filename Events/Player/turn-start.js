"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const getEvents = (clientRegistry = ClientRegistry_1.instance, engine = Engine_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    [
        'player:turn-start',
        (player) => {
            ruleRegistry.process(TurnStart_1.default, player);
            const client = clientRegistry.getByPlayer(player);
            client
                .takeTurn()
                .catch((error) => console.error(error))
                .finally(() => {
                engine.emit('player:turn-end', player);
            });
        },
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=turn-start.js.map