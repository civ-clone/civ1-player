"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Captured_1 = require("@civ-clone/core-city/Rules/Captured");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityRegistry = CityRegistry_1.instance, engine = Engine_1.instance) => [
    new Captured_1.default(
    // TODO: have some `Rule`s that just call `Player#defeated` or something?
    new Criterion_1.default((capturedCity, capturingPlayer, originalPlayer) => cityRegistry
        .getByPlayer(originalPlayer)
        .filter((city) => city !== capturedCity).length === 0), new Effect_1.default((capturedCity, capturingPlayer, player) => {
        engine.emit('player:defeated', player, capturingPlayer);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=captured.js.map