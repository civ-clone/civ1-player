"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Defeated_1 = require("@civ-clone/core-player/Rules/Defeated");
const Destroyed_1 = require("@civ-clone/core-unit/Rules/Destroyed");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const isDefeated_1 = require("../../lib/isDefeated");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
const getRules = (cityRegistry = CityRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance) => [
    new Destroyed_1.default('civ1-player:unit/destroyed/defeat-when-no-cities', 
    // Barbarians are never defeated (civ-clone/web-renderer#169).
    new Criterion_1.default((unit) => !(0, isBarbarian_1.default)(unit.player())), new Criterion_1.default((unit) => (0, isDefeated_1.default)(unit.player(), cityRegistry, unitRegistry, clientRegistry, unit, true)), new Effect_1.default((unit, destroyingPlayer) => {
        // Checked here rather than as a `Criterion`: every `Criterion` is evaluated before any `Effect` runs, and an
        //  earlier `Effect` of this same rule set can be what defeats the player. civ1-city disbands the units a
        //  captured or destroyed city supported, and when it was the player's last, the first of those to go defeats the
        //  player, taking the rest with it; defeating it again here brought another civilization back for each
        //  (civ-clone/web-renderer#600).
        if (!playerRegistry.includes(unit.player())) {
            return;
        }
        ruleRegistry.process(Defeated_1.default, unit.player(), destroyingPlayer);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=destroyed.js.map