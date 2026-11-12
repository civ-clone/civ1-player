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
    new TurnStart_1.default('civ1-player:player/turn-start/process-city-yields', new High_1.default(), new Effect_1.default((player) => {
        // This will need to be excluded/replaced/updated if the base yields change, but having a dynamic approach here
        // causes the wrong values to be processed.
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
                .forEach((cityYield) => {
                // Once the city is gone, none of the rest of its yields are processed: a city that starves away on its
                //  food completes nothing on its shields, and its shields and trade go with it
                //  (civ-clone/web-renderer#975). Nothing completing in it also means no Wonder is ever registered as
                //  standing in a city that no longer exists.
                //
                // v474.05 `city_process` (`CITYMGT.C`) leaves a city it destroys at once, `goto label_exit;` skipping
                //  everything after, as when its Settlers empty it (598-604):
                //
                //  ```c
                //  if (--townbuf[city].size == 0) {
                //      vanish(city, townbuf[city].x, townbuf[city].y);
                //      ...
                //      goto label_exit;
                //  ```
                //
                //  It starves a city one pass later than this does, though: the turn's food is added to the box with the
                //  shields (573-582: `townbuf[city].food_box += town_res_sums[0] - townbuf[city].size * 2 - ...;`,
                //  then `townbuf[city].shield_box += scratch_i;` and the build is checked), and only a box left below
                //  zero is resolved, at the start of the city's next pass, before anything else is worked out (287-313:
                //  `if (townbuf[city].food_box < 0) { ... if (--townbuf[city].size == 0) { vanish(...); ...
                //  goto label_exit; }`). So the original completes the dying turn's build and then loses the city; here
                //  the city is lost on the turn its food runs out, and that turn's build isn't completed.
                if (city.destroyed()) {
                    return;
                }
                ruleRegistry.process(ProcessYield_1.default, cityYield, city, cityYields);
            });
        });
    })),
    new TurnStart_1.default('civ1-player:player/turn-start/reset-units', new Effect_1.default((player) => unitRegistry.getByPlayer(player).forEach((unit) => {
        if (unit.destroyed()) {
            return;
        }
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
        // It's the job of the `DelayedAction` to set the `Unit` as active, otherwise `Action`s that chain `Busy` will
        // end up being cleared here.
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=turn-start.js.map