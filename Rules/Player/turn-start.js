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
const Yields_1 = require("@civ-clone/civ1-world/Yields");
const getRules = (ruleRegistry = RuleRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, cityRegistry = CityRegistry_1.instance, playerRegistry = PlayerRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => [
    new TurnStart_1.default(new Effect_1.default((player) => {
        const rules = ruleRegistry.get(ProcessYield_1.ProcessYield);
        // process cities first in case units are created
        cityRegistry.getByPlayer(player).forEach((city) => {
            const food = new Yields_1.Food(0, 'consolidated'), production = new Yields_1.Production(0, 'consolidated'), trade = new Yields_1.Trade(0, 'consolidated'), cityYields = [food, production, trade];
            city.yields().forEach((cityYield) => {
                if (cityYield instanceof Yields_1.Food) {
                    food.add(cityYield);
                    return;
                }
                if (cityYield instanceof Yields_1.Production) {
                    production.add(cityYield);
                    return;
                }
                if (cityYield instanceof Yields_1.Trade) {
                    trade.add(cityYield);
                    return;
                }
                cityYields.push(cityYield);
            });
            cityYields.forEach((cityYield) => rules
                .filter((rule) => rule.validate(cityYield, city, cityYields))
                .forEach((rule) => rule.process(cityYield, city, cityYields)));
        });
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
    new TurnStart_1.default(new Effect_1.default((player) => {
        clientRegistry
            .getByPlayer(player)
            .takeTurn()
            .then(() => {
            ruleRegistry.process(TurnEnd_1.default, player);
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=turn-start.js.map