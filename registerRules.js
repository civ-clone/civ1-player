"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const captured_1 = require("./Rules/City/captured");
const destroyed_1 = require("./Rules/City/destroyed");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const action_1 = require("./Rules/Player/action");
const added_1 = require("./Rules/Player/added");
const defeated_1 = require("./Rules/Player/defeated");
const spawn_1 = require("./Rules/Player/spawn");
const turn_start_1 = require("./Rules/Player/turn-start");
const visibility_changed_1 = require("./Rules/Player/visibility-changed");
const built_1 = require("./Rules/TileImprovement/built");
const destroyed_2 = require("./Rules/Unit/destroyed");
const visibility_1 = require("./Rules/Unit/visibility");
const built_2 = require("./Rules/World/built");
RuleRegistry_1.instance.register(...(0, captured_1.default)(), ...(0, destroyed_1.default)(), ...(0, action_1.default)(), ...(0, added_1.default)(), ...(0, defeated_1.default)(), ...(0, spawn_1.default)(), ...(0, turn_start_1.default)(), ...(0, visibility_changed_1.default)(), ...(0, built_1.default)(), ...(0, destroyed_2.default)(), ...(0, visibility_1.default)(), ...(0, built_2.default)());
//# sourceMappingURL=registerRules.js.map