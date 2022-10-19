"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Yields_1 = require("@civ-clone/civ1-world/Yields");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const High_1 = require("@civ-clone/core-rule/Priorities/High");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const getRules = (ruleRegistry = RuleRegistry_1.instance, cityRegistry = CityRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => [
    new TurnStart_1.default(new High_1.default(), new Effect_1.default((player) => {
        cityRegistry.getByPlayer(player).forEach((city) => {
            const cityYields = city.yields();
            (0, reduceYields_1.reduceYields)(cityYields, Yields_1.Food, Yields_1.Production, Yields_1.Trade)
                .reduce((yields, yieldValue, index) => {
                yields[index].set(yieldValue, 'Consolidated');
                return yields;
            }, [
                new Yields_1.Food(0, 'Consolidated'),
                new Yields_1.Production(0, 'Consolidated'),
                new Yields_1.Trade(0, 'Consolidated'),
            ])
                .forEach((cityYield) => ruleRegistry.process(ProcessYield_1.default, cityYield, city, cityYields));
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
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=turn-start.js.map