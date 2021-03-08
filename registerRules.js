"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const added_1 = require("./Rules/Player/added");
const start_1 = require("./Rules/Turn/start");
const created_1 = require("./Rules/Unit/created");
const built_1 = require("./Rules/World/built");
// import turnStart from './Rules/Player/turn-start';
// import turnEnd from './Rules/Player/turn-end';
const visibility_1 = require("./Rules/Unit/visibility");
const visibility_changed_1 = require("./Rules/Player/visibility-changed");
RuleRegistry_1.instance.register(...added_1.default(), ...created_1.default(), ...start_1.default(), ...built_1.default(), 
// these are problematic so we need to stick to events for now
// ...turnEnd(),
// ...turnStart()
...visibility_1.default(), ...visibility_changed_1.default());
//# sourceMappingURL=registerRules.js.map