"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const turns_1 = require("@civ-clone/base-player/lib/turns");
const getEvents = (clientRegistry = ClientRegistry_1.instance, engine = Engine_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    [
        'player:turn-start',
        (player) => {
            (0, turns_1.startPlayerTurn)(player, clientRegistry, engine, ruleRegistry);
        },
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=turn-start.js.map