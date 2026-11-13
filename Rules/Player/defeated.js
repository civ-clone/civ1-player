"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Defeated_1 = require("@civ-clone/core-player/Rules/Defeated");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const defeat_1 = require("@civ-clone/base-player/lib/defeat");
const events_1 = require("@civ-clone/base-player/lib/events");
const leaveGame_1 = require("@civ-clone/base-player/lib/leaveGame");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const getRules = (currentPlayerRegistry = CurrentPlayerRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, unitRegistry = UnitRegistry_1.instance, engine = Engine_1.instance) => [
    new Defeated_1.default('civ1-player:player/defeated/remove-current-player', new Criterion_1.default((player) => (0, leaveGame_1.isStillToMove)(player, currentPlayerRegistry)), new Effect_1.default((player) => (0, leaveGame_1.stopMoving)(player, currentPlayerRegistry))),
    new Defeated_1.default('civ1-player:player/defeated/unregister', new Criterion_1.default((player) => (0, leaveGame_1.isInGame)(player, playerRegistry)), new Effect_1.default((player) => (0, leaveGame_1.leaveGame)(player, playerRegistry))),
    new Defeated_1.default('civ1-player:player/defeated/destroy-units', new Effect_1.default((player, defeatingPlayer) => (0, defeat_1.destroyUnits)(player, defeatingPlayer, ruleRegistry, unitRegistry))),
    new Defeated_1.default('civ1-player:player/defeated/emit', new Effect_1.default((player, capturingPlayer) => {
        (0, events_1.emitDefeated)(player, capturingPlayer, engine);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=defeated.js.map