"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CivilizationRegistry_1 = require("@civ-clone/core-civilization/CivilizationRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Built_1 = require("@civ-clone/core-world/Rules/Built");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Food_1 = require("@civ-clone/base-terrain-yield-food/Food");
const Grassland_1 = require("@civ-clone/base-terrain-grassland/Grassland");
const Plains_1 = require("@civ-clone/base-terrain-plains/Plains");
const PlayerWorld_1 = require("@civ-clone/core-player-world/PlayerWorld");
const Production_1 = require("@civ-clone/base-terrain-yield-production/Production");
const River_1 = require("@civ-clone/base-terrain-river/River");
const Settlers_1 = require("@civ-clone/base-unit-settlers/Settlers");
const Trade_1 = require("@civ-clone/base-terrain-yield-trade/Trade");
const worker_threads_1 = require("worker_threads");
const getRules = (civilizationRegistry = CivilizationRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, engine = Engine_1.instance, playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, randomNumberGenerator = () => Math.random()) => [
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
        const numberOfPlayers = engine.option('players', 5), usedStartSquares = [], worker = new worker_threads_1.Worker(__dirname + '/sortStartTiles.js', {
            workerData: {
                numberOfRequiredTiles: numberOfPlayers * 20,
                // This still takes a little while to process, but doesn't lock the main thread for as long...
                tiles: world
                    .entries()
                    .filter((tile) => [Grassland_1.default, Plains_1.default, River_1.default].some((TerrainType) => tile.terrain() instanceof TerrainType))
                    .map((tile) => ({
                    x: tile.x(),
                    y: tile.y(),
                    score: areaScore(tile),
                })),
            },
        });
        worker.on('error', (error) => console.error(error));
        worker.on('messageerror', (error) => console.error(error));
        // TODO: this could pick a large cluster of squares all next to each other resulting in a situation where not enough
        //  meet the criteria of having a distance of >4...
        worker.on('message', (startSquares) => {
            const startingSquares = startSquares.map(({ x, y }) => world.get(x, y));
            engine.emit('world:start-tiles', startingSquares);
            // TODO: this needs to be setting up right clients for each player
            clientRegistry.entries()
                .reduce((promise, client) => promise.then(async () => {
                const player = client.player();
                await client.chooseCivilization(civilizationRegistry.entries());
                civilizationRegistry.unregister(player.civilization().sourceClass());
                // TODO: configurable/Rule?
                startingSquares
                    .filter((tile) => usedStartSquares.some((startSquare) => startSquare.distanceFrom(tile) <= 4))
                    .forEach((tile) => startingSquares.splice(startingSquares.indexOf(tile), 1));
                const startingSquare = startingSquares[Math.floor(startingSquares.length * randomNumberGenerator())];
                if (!startingSquare) {
                    throw new TypeError('Not enough `startingSquare`s.');
                }
                usedStartSquares.push(startingSquare);
                // TODO: have this `Rule` controlled
                new Settlers_1.default(null, player, startingSquare, ruleRegistry);
            }), Promise.resolve())
                .then(() => engine.emit('game:start'));
        });
    })),
    new Built_1.default(new Effect_1.default((world) => {
        engine.emit('world:built', world);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map