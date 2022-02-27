"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const destroyed_1 = require("./Rules/City/destroyed");
const added_1 = require("./Rules/Player/added");
const action_1 = require("./Rules/Player/action");
const start_1 = require("./Rules/Turn/start");
const created_1 = require("./Rules/Unit/created");
const destroyed_2 = require("./Rules/Unit/destroyed");
const visibility_1 = require("./Rules/Unit/visibility");
const visibility_changed_1 = require("./Rules/Player/visibility-changed");
const built_1 = require("./Rules/World/built");
// import turnStart from './Rules/Player/turn-start';
// import turnEnd from './Rules/Player/turn-end';
RuleRegistry_1.instance.register(...(0, destroyed_1.default)(), ...(0, added_1.default)(), ...(0, action_1.default)(), ...(0, created_1.default)(), ...(0, destroyed_2.default)(), ...(0, start_1.default)(), ...(0, visibility_1.default)(), ...(0, visibility_changed_1.default)(), ...(0, built_1.default)()
// these are problematic so we need to stick to events for now
// ...turnEnd(),
// ...turnStart()
);
//# sourceMappingURL=registerRules.js.map