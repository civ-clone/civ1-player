"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Captured_1 = require("@civ-clone/core-city/Rules/Captured");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Defeated_1 = require("@civ-clone/core-player/Rules/Defeated");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityRegistry = CityRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new Captured_1.default(
    // TODO: have some `Rule`s that just call `Player#defeated` or something?
    new Criterion_1.default((capturedCity, capturingPlayer, originalPlayer) => cityRegistry
        .getByPlayer(originalPlayer)
        .filter((city) => city !== capturedCity).length === 0
    // TODO: check for "total annihilation" setting and check number of units
    // && unitRegistry.getByPlayer(destroyedCity.player()).length === 0
    ), new Effect_1.default((capturedCity, capturingPlayer, player) => {
        ruleRegistry.process(Defeated_1.default, player, capturingPlayer);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=captured.js.map