"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Defeated_1 = require("@civ-clone/core-player/Rules/Defeated");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (currentPlayerRegistry = CurrentPlayerRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, engine = Engine_1.instance) => [
    new Defeated_1.default(new Criterion_1.default((player) => currentPlayerRegistry.includes(player)), new Effect_1.default((player) => currentPlayerRegistry.unregister(player))),
    new Defeated_1.default(new Criterion_1.default((player) => playerRegistry.includes(player)), new Effect_1.default((player) => playerRegistry.unregister(player))),
    new Defeated_1.default(new Effect_1.default((player, capturingPlayer) => {
        engine.emit('player:defeated', player, capturingPlayer);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=defeated.js.map