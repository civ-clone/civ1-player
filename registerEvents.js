"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defeated_1 = require("./Events/Player/defeated");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const start_1 = require("./Events/Turn/start");
const turn_end_1 = require("./Events/Player/turn-end");
const turn_start_1 = require("./Events/Player/turn-start");
[
    ...defeated_1.default(),
    ...start_1.default(),
    ...turn_end_1.default(),
    ...turn_start_1.default(),
].forEach(([event, handler]) => Engine_1.instance.on(event, handler));
//# sourceMappingURL=registerEvents.js.map