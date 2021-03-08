"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const VisibilityChanged_1 = require("@civ-clone/core-player-world/Rules/Player/VisibilityChanged");
const getRules = (engine = Engine_1.instance) => [
    new VisibilityChanged_1.default(new Effect_1.default((tile, player) => {
        engine.emit('player:visibility-changed', tile, player);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=visibility-changed.js.map