"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Created_1 = require("@civ-clone/core-unit/Rules/Created");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = () => [
    new Created_1.default(new Effect_1.default((unit) => unit.applyVisibility())),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=created.js.map