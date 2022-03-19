"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const CurrentPlayerRegistry_1 = require("@civ-clone/core-player/CurrentPlayerRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const getEvents = (cityRegistry = CityRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, currentPlayerRegistry = CurrentPlayerRegistry_1.instance, engine = Engine_1.instance, ruleRegistry = RuleRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => [
    [
        'player:turn-start',
        (player) => {
            ruleRegistry.process(TurnStart_1.TurnStart, player);
            const client = clientRegistry.getByPlayer(player);
            client.takeTurn().then(() => {
                engine.emit('player:turn-end', player);
            });
        },
    ],
    [
        'player:turn-start',
        (player) => {
            const rules = ruleRegistry.get(ProcessYield_1.ProcessYield);
            // process cities first in case units are created
            cityRegistry
                .getByPlayer(player)
                .forEach((city) => city
                .yields()
                .forEach((cityYield) => rules
                .filter((rule) => rule.validate(cityYield, city))
                .forEach((rule) => rule.process(cityYield, city))));
        },
    ],
    [
        'player:turn-start',
        (player) => unitRegistry.getByPlayer(player).forEach((unit) => {
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
        }),
    ],
];
exports.getEvents = getEvents;
exports.default = exports.getEvents;
//# sourceMappingURL=turn-start.js.map