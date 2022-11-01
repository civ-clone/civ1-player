"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Food_1 = require("@civ-clone/base-terrain-yield-food/Food");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const Production_1 = require("@civ-clone/base-terrain-yield-production/Production");
const Trade_1 = require("@civ-clone/base-terrain-yield-trade/Trade");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const getRules = (ruleRegistry = RuleRegistry_1.instance, cityRegistry = CityRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => [
    new TurnStart_1.default(new High_1.default(), new Effect_1.default((player) => {
        cityRegistry.getByPlayer(player).forEach((city) => {
            const cityYields = city.yields();
            (0, reduceYields_1.reduceYields)(cityYields, Food_1.default, Production_1.default, Trade_1.default)
                .reduce((yields, yieldValue, index) => {
                yields[index].set(yieldValue, 'Consolidated');
                return yields;
            }, [
                new Food_1.default(0, 'Consolidated'),
                new Production_1.default(0, 'Consolidated'),
                new Trade_1.default(0, 'Consolidated'),
            ])
                .forEach((cityYield) => ruleRegistry.process(ProcessYield_1.default, cityYield, city, cityYields));
        });
    })),
    new TurnStart_1.default(new Effect_1.default((player) => unitRegistry.getByPlayer(player).forEach((unit) => {
        unit.moves().set(unit.movement());
        const busyAction = unit.busy();
        if (!busyAction) {
            unit.setActive();
            unit.setWaiting(false);
            return;
        }
        if (!busyAction.validate()) {
            return;
        }
        busyAction.process();
        unit.setBusy();
        unit.setActive();
        unit.setWaiting(false);
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=turn-start.js.map