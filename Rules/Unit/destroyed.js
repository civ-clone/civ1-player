"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Defeated_1 = require("@civ-clone/core-player/Rules/Defeated");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Rule_1 = require("@civ-clone/core-rule/Rule");
const getRules = (cityRegistry = CityRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new Rule_1.default(new Criterion_1.default((unit, destroyingPlayer) => cityRegistry.getByPlayer(unit.player()).length === 0
    // TODO: check for "total annihilation" setting and check number of units
    // && unitRegistry.getByPlayer(unit.player()).length === 0
    ), new Effect_1.default((unit, destroyingPlayer) => ruleRegistry.process(Defeated_1.default, unit.player(), destroyingPlayer))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=destroyed.js.map