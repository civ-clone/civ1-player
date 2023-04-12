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
const ChoiceMeta_1 = require("@civ-clone/core-client/ChoiceMeta");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Food_1 = require("@civ-clone/base-terrain-yield-food/Food");
const Grassland_1 = require("@civ-clone/base-terrain-grassland/Grassland");
const PickStartTile_1 = require("@civ-clone/core-world-generator/Rules/PickStartTile");
const Plains_1 = require("@civ-clone/base-terrain-plains/Plains");
const PlayerWorld_1 = require("@civ-clone/core-player-world/PlayerWorld");
const Production_1 = require("@civ-clone/base-terrain-yield-production/Production");
const River_1 = require("@civ-clone/base-terrain-river/River");
const Spawn_1 = require("@civ-clone/core-player/Rules/Spawn");
const Trade_1 = require("@civ-clone/base-terrain-yield-trade/Trade");
const getRules = (civilizationRegistry = CivilizationRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, engine = Engine_1.instance, playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, leaderRegistry = LeaderRegistry_1.instance, attributeRegistry = AttributeRegistry_1.instance, cityNameRegistry = CityNameRegistry_1.instance, traitRegistry = TraitRegistry_1.instance) => [
    new Built_1.default(new Effect_1.default((world) => playerRegistry
        .entries()
        .forEach((player) => playerWorldRegistry.register(new PlayerWorld_1.default(player, world))))),
    new Built_1.default(new Effect_1.default((world) => {
        const tileCache = new Map(), areaCache = new Map(), tileScore = (tile, player = null) => {
            if (!tileCache.has(tile)) {
                tileCache.set(tile, tile.score(player, [
                    [Food_1.default, 8],
                    [Production_1.default, 3],
                    [Trade_1.default, 1],
                ]));
            }
            return tileCache.get(tile);
        }, areaScore = (tile, player = null) => {
            if (!areaCache.has(tile)) {
                areaCache.set(tile, tile
                    .getSurroundingArea()
                    .entries()
                    .reduce((total, tile) => total + tileScore(tile, player), 0));
            }
            return areaCache.get(tile);
        };
        engine.emit('world:generate-start-tiles');
        const usedStartSquares = [], startingSquares = world
            .entries()
            .filter((tile) => [Grassland_1.default, Plains_1.default, River_1.default].some((TerrainType) => tile.terrain() instanceof TerrainType))
            .map((tile) => ({
            tile,
            score: areaScore(tile),
        }))
            .sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)
            .map(({ tile }) => tile);
        engine.emit('world:start-tiles', startingSquares);
        clientRegistry.entries()
            .reduce((promise, client) => promise.then(async () => {
            const player = client.player(), CivilizationChoice = await client.chooseFromList(new ChoiceMeta_1.default(civilizationRegistry.entries(), 'choose-civilization')), civilization = new CivilizationChoice(attributeRegistry, cityNameRegistry);
            player.setCivilization(civilization);
            const LeaderChoice = await client.chooseFromList(new ChoiceMeta_1.default(leaderRegistry.getByCivilization(civilization.sourceClass()), 'choose-leader')), leader = new LeaderChoice(traitRegistry);
            civilization.setLeader(leader);
            civilizationRegistry.unregister(civilization.sourceClass());
            leaderRegistry.unregister(leader.sourceClass());
            const [startingSquare] = ruleRegistry.process(PickStartTile_1.default, world, player, usedStartSquares);
            if (!startingSquare) {
                throw new TypeError('Not enough `startingSquare`s.');
            }
            usedStartSquares.push(startingSquare);
            ruleRegistry.process(Spawn_1.default, player, startingSquare);
        }), Promise.resolve())
            .then(() => engine.emit('game:start'));
    })),
    new Built_1.default(new Effect_1.default((world) => {
        engine.emit('world:built', world);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map