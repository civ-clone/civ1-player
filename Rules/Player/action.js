"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const endTurn_1 = require("@civ-clone/base-player/lib/endTurn");
const Action_1 = require("@civ-clone/core-player/Rules/Action");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priority_1 = require("@civ-clone/core-rule/Priority");
// Defined here so we can reference it
const endOfTurnRule = new Action_1.default('civ1-player:player/action/end-turn', 
// `Low` is probably enough in most cases, but just to make sure, it's over 9000
new Priority_1.default(9001), 
// Switched off while it asks, to prevent infinite recursion; only whether there is another is asked
//  (civ-clone/web-renderer#314).
new Criterion_1.default((player) => (0, endTurn_1.hasNoOtherMandatoryActions)(player, endOfTurnRule)), new Effect_1.default((player) => (0, endTurn_1.endTurnActions)(player)));
const getRules = () => [endOfTurnRule];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=action.js.map