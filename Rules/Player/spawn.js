"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Settlers_1 = require("@civ-clone/base-unit-settlers/Settlers");
const Spawn_1 = require("@civ-clone/core-player/Rules/Spawn");
const spawnUnits_1 = require("@civ-clone/base-player/lib/spawnUnits");
const getRules = (ruleRegistry = RuleRegistry_1.instance) => [
    new Spawn_1.default('civ1-player:player/spawn/settlers', 
    // Civilization's start units: one Settlers.
    new Effect_1.default((player, tile) => {
        (0, spawnUnits_1.default)(player, tile, [Settlers_1.default], ruleRegistry);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spawn.js.map