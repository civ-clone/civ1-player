"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Added_1 = require("@civ-clone/core-player/Rules/Added");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const events_1 = require("@civ-clone/base-player/lib/events");
const getRules = (engine = Engine_1.instance) => [
    new Added_1.default('civ1-player:player/added/emit', new Effect_1.default((player) => {
        (0, events_1.emitAdded)(player, engine);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=added.js.map