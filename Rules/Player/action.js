"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Action_1 = require("@civ-clone/core-player/Rules/Action");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const EndTurn_1 = require("@civ-clone/base-player-action-end-turn/EndTurn");
const Priority_1 = require("@civ-clone/core-rule/Priority");
// Defined here so we can reference it
const endOfTurnRule = new Action_1.default(new Criterion_1.default((player) => {
    // Prevent infinite recursion...
    endOfTurnRule.disable();
    const otherActions = player.mandatoryActions();
    endOfTurnRule.enable();
    return otherActions.length === 0;
}), new Effect_1.default(() => [new EndTurn_1.default(null)]), new Priority_1.default(9001) // `Low` is probably enough in most cases, but just to make sure, it's over 9000
);
const getRules = () => [endOfTurnRule];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=action.js.map