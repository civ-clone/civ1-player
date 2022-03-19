"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Rule_1 = require("@civ-clone/core-rule/Rule");
const getRules = (cityRegistry = CityRegistry_1.instance, engine = Engine_1.instance, unitRegistry = UnitRegistry_1.instance) => [
    new Rule_1.default(new Criterion_1.default((destroyedCity, player) => cityRegistry
        .getByPlayer(destroyedCity.player())
        .filter((city) => city !== destroyedCity).length === 0
    // TODO: check for "total annihilation" setting and check number of units
    // && unitRegistry.getByPlayer(destroyedCity.player()).length === 0
    ), new Effect_1.default((city, player) => engine.emit('player:defeated', city.player(), player))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=destroyed.js.map