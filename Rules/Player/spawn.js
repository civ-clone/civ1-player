"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Settlers_1 = require("@civ-clone/base-unit-settlers/Settlers");
const Spawn_1 = require("@civ-clone/core-player/Rules/Spawn");
const getRules = (ruleRegistry = RuleRegistry_1.instance) => [
    new Spawn_1.default(new Effect_1.default((player, tile) => {
        new Settlers_1.default(null, player, tile, ruleRegistry);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spawn.js.map