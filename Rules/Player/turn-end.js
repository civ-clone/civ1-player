"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TurnEnd_1 = require("@civ-clone/core-player/Rules/TurnEnd");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const getRules = (currentPlayerRegistry = CurrentPlayerRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, engine = Engine_1.instance) => [
    new TurnEnd_1.default(new Criterion_1.default(() => currentPlayerRegistry.length > 1), new Effect_1.default((player) => {
        const [nextPlayer] = currentPlayerRegistry.entries();
        currentPlayerRegistry.unregister(player);
        ruleRegistry.process(TurnStart_1.default, nextPlayer);
        engine.emit('player:turn-start', nextPlayer);
    })),
    new TurnEnd_1.default(new Criterion_1.default(() => currentPlayerRegistry.length <= 1), new Effect_1.default((player) => {
        currentPlayerRegistry.unregister(player);
        engine.emit('turn:end');
    })),
    new TurnEnd_1.default(new Effect_1.default((player) => {
        engine.emit('player:turn-end', player);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=turn-end.js.map