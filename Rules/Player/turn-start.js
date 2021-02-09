"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TurnEnd_1 = require("@civ-clone/core-player/Rules/TurnEnd");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const getRules = (ruleRegistry = RuleRegistry_1.instance, clientRegistry = ClientRegistry_1.instance) => [
    new TurnStart_1.default(new Effect_1.default((player) => {
        clientRegistry
            .getByPlayer(player)
            .takeTurn()
            .then(() => {
            ruleRegistry.process(TurnEnd_1.default, player);
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=turn-start.js.map