"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const AttributeRegistry_1 = require("@civ-clone/core-civilization/AttributeRegistry");
const CityNameRegistry_1 = require("@civ-clone/core-civilization/CityNameRegistry");
const CivilizationRegistry_1 = require("@civ-clone/core-civilization/CivilizationRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const LeaderRegistry_1 = require("@civ-clone/core-civilization/LeaderRegistry");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TraitRegistry_1 = require("@civ-clone/core-civilization/TraitRegistry");
const Built_1 = require("@civ-clone/core-world/Rules/Built");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Food_1 = require("@civ-clone/base-terrain-yield-food/Food");
const Grassland_1 = require("@civ-clone/base-terrain-grassland/Grassland");
const Plains_1 = require("@civ-clone/base-terrain-plains/Plains");
const PlayerWorld_1 = require("@civ-clone/core-player-world/PlayerWorld");
const Production_1 = require("@civ-clone/base-terrain-yield-production/Production");
const River_1 = require("@civ-clone/base-terrain-river/River");
const Trade_1 = require("@civ-clone/base-terrain-yield-trade/Trade");
const startTiles_1 = require("@civ-clone/base-player/lib/startTiles");
const seatPlayers_1 = require("@civ-clone/base-player/lib/seatPlayers");
const getRules = (civilizationRegistry = CivilizationRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, engine = Engine_1.instance, playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, leaderRegistry = LeaderRegistry_1.instance, attributeRegistry = AttributeRegistry_1.instance, cityNameRegistry = CityNameRegistry_1.instance, traitRegistry = TraitRegistry_1.instance) => [
    new Built_1.default('civ1-player:world/built/register-player-worlds', new Effect_1.default((world) => playerRegistry
        .entries()
        .forEach((player) => playerWorldRegistry.register(new PlayerWorld_1.default(player, world))))),
    new Built_1.default('civ1-player:world/built/choose-start-tiles', new Effect_1.default((world) => {
        engine.emit('world:generate-start-tiles');
        // Where Civilization's players may start: grassland, plains or river, ranked by the area around each, with food
        //  weighted 8, shields 3 and trade 1.
        const startingSquares = (0, startTiles_1.default)(world, [Grassland_1.default, Plains_1.default, River_1.default], [
            [Food_1.default, 8],
            [Production_1.default, 3],
            [Trade_1.default, 1],
        ]);
        engine.emit('world:start-tiles', startingSquares);
        (0, seatPlayers_1.default)(world, clientRegistry, civilizationRegistry, leaderRegistry, attributeRegistry, cityNameRegistry, traitRegistry, ruleRegistry).then(() => engine.emit('game:start'));
    })),
    new Built_1.default('civ1-player:world/built/emit', new Effect_1.default((world) => {
        engine.emit('world:built', world);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map