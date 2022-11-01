"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Generator_generator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TerrainRegistry_1 = require("@civ-clone/core-terrain/TerrainRegistry");
const BaseGenerator_1 = require("@civ-clone/simple-world-generator/BaseGenerator");
class Generator extends BaseGenerator_1.default {
    constructor(height, width, generator, options = {}, ruleRegistry = RuleRegistry_1.instance, terrainRegistry = TerrainRegistry_1.instance) {
        super(height, width, options, ruleRegistry, terrainRegistry);
        _Generator_generator.set(this, void 0);
        __classPrivateFieldSet(this, _Generator_generator, generator, "f");
    }
    async generate() {
        return new Array(this.height() * this.width())
            .fill(0)
            .map((_, i) => __classPrivateFieldGet(this, _Generator_generator, "f").call(this, i));
    }
}
exports.Generator = Generator;
_Generator_generator = new WeakMap();
exports.default = Generator;
//# sourceMappingURL=Generator.js.map