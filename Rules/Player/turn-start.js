"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TurnEnd_1 = require("@civ-clone/core-player/Rules/TurnEnd");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const getRules = (ruleRegistry = RuleRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, cityRegistry = CityRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => [
    new TurnStart_1.default(new Effect_1.default((player) => {
        clientRegistry
            .getByPlayer(player)
            .takeTurn()
            .then(() => {
            ruleRegistry.process(TurnEnd_1.default, player);
        });
    })),
    new TurnStart_1.default(new Effect_1.default((player) => {
        const rules = ruleRegistry.get(ProcessYield_1.ProcessYield);
        // process cities first in case units are created
        cityRegistry
            .getByPlayer(player)
            .forEach((city) => city
            .yields()
            .forEach((cityYield) => rules
            .filter((rule) => rule.validate(cityYield, city))
            .forEach((rule) => rule.process(cityYield, city))));
    })),
    new TurnStart_1.default(new Effect_1.default((player) => unitRegistry.getByPlayer(player).forEach((unit) => {
        unit.moves().set(unit.movement());
        const busyAction = unit.busy();
        if (busyAction) {
            if (!busyAction.validate()) {
                return;
            }
            busyAction.process();
            return;
        }
        unit.setActive();
        unit.setWaiting(false);
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=turn-start.js.map