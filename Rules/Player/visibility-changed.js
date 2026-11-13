"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const VisibilityChanged_1 = require("@civ-clone/core-player-world/Rules/Player/VisibilityChanged");
const events_1 = require("@civ-clone/base-player/lib/events");
const getRules = (engine = Engine_1.instance) => [
    new VisibilityChanged_1.default('civ1-player:player/visibility-changed/emit', new Effect_1.default((tile, player) => {
        (0, events_1.emitVisibilityChanged)(tile, player, engine);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=visibility-changed.js.map