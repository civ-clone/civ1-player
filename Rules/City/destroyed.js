"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Defeated_1 = require("@civ-clone/core-player/Rules/Defeated");
const Destroyed_1 = require("@civ-clone/core-city/Rules/Destroyed");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityRegistry = CityRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new Destroyed_1.default(new Criterion_1.default((destroyedCity, destroyingPlayer) => cityRegistry
        .getByPlayer(destroyedCity.player())
        .filter((city) => city !== destroyedCity).length === 0
    // TODO: check for "total annihilation" setting and check number of units
    // && unitRegistry.getByPlayer(destroyedCity.player()).length === 0
    ), new Effect_1.default((city, destroyingPlayer) => ruleRegistry.process(Defeated_1.default, city.player(), destroyingPlayer))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=destroyed.js.map