"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
const getRules = (ruleRegistry = RuleRegistry_1.instance, cityRegistry = CityRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => [
    new Start_1.default(new Effect_1.default(() => {
        const rules = ruleRegistry.get(ProcessYield_1.ProcessYield);
        playerRegistry.forEach((player) => 
        // process cities first in case units are created
        cityRegistry
            .getByPlayer(player)
            .forEach((city) => city
            .yields()
            .forEach((cityYield) => rules
            .filter((rule) => rule.validate(cityYield, city))
            .forEach((rule) => rule.process(cityYield, city)))));
    })),
    new Start_1.default(new Effect_1.default(() => playerRegistry.forEach((player) => unitRegistry.getByPlayer(player).forEach((unit) => {
        const busyAction = unit.busy();
        if (busyAction) {
            if (!busyAction.validate()) {
                return;
            }
            busyAction.process();
            return;
        }
        unit.setActive();
        unit.moves().set(unit.movement());
        unit.setWaiting(false);
    })))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map