"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CivilizationRegistry_1 = require("@civ-clone/core-civilization/CivilizationRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Yields_1 = require("@civ-clone/civ1-world/Yields");
const Terrains_1 = require("@civ-clone/civ1-world/Terrains");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Built_1 = require("@civ-clone/core-world/Rules/Built");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PlayerWorld_1 = require("@civ-clone/core-player-world/PlayerWorld");
const Settlers_1 = require("@civ-clone/base-unit-settlers/Settlers");
const worker_threads_1 = require("worker_threads");
const getRules = (civilizationRegistry = CivilizationRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, engine = Engine_1.instance, playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, randomNumberGenerator = () => Math.random()) => [
    new Built_1.default(new Effect_1.default((world) => playerRegistry
        .entries()
        .forEach((player) => playerWorldRegistry.register(new PlayerWorld_1.default(player, world))))),
    new Built_1.default(new Effect_1.default((world) => {
        const tileCache = new Map(), areaCache = new Map(), tileScore = (tile, player) => {
            if (!tileCache.has(tile)) {
                tileCache.set(tile, tile.score(player, [
                    [Yields_1.Food, 8],
                    [Yields_1.Production, 3],
                    [Yields_1.Trade, 1],
                ]));
            }
            return tileCache.get(tile);
        }, areaScore = (tile, player) => {
            if (!areaCache.has(tile)) {
                areaCache.set(tile, tile
                    .getSurroundingArea()
                    .entries()
                    .reduce((total, tile) => total + tileScore(tile, player), 0));
            }
            return areaCache.get(tile);
        };
        engine.emit('world:generate-start-tiles');
        const numberOfPlayers = engine.option('players', 5), usedStartSquares = [], [player] = playerRegistry.entries(), worker = new worker_threads_1.Worker(__dirname + '/sortStartTiles.js', {
            workerData: {
                numberOfRequiredTiles: numberOfPlayers * 20,
                // This still takes a little while to process, but doesn't lock the main thread for as long...
                tiles: world
                    .entries()
                    .filter((tile) => [Terrains_1.Grassland, Terrains_1.Plains, Terrains_1.River].some((TerrainType) => tile.terrain() instanceof TerrainType))
                    .map((tile) => ({
                    x: tile.x(),
                    y: tile.y(),
                    score: areaScore(tile, player),
                })),
            },
        });
        // worker.on('error', (error) => reject(error));
        // worker.on('messageerror', (error) => reject(error));
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
                civilizationRegistry.unregister(player.civilization().constructor);
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
                new Settlers_1.default(null, player, startingSquare);
                // ensure surrounding tiles are visible
                startingSquare
                    .getSurroundingArea()
                    .forEach((tile) => {
                    engine.emit('tile:seen', tile, player);
                });
            }), Promise.resolve())
                .then(() => engine.emit('game:start'));
        });
        // // TODO: this could pick a large cluster of squares all next to each other resulting in a situation where not enough
        // //  meet the criteria of having a distance of >4...
        // let startingSquares = world.filter((tile: Tile): boolean =>
        //   [Grassland, Plains, River].some(
        //     (TerrainType: typeof Terrain) => tile.terrain() instanceof TerrainType
        //   )
        // );x
        // .sort(
        //   // (a: Tile, b: Tile): number =>
        //   //   areaScore(b, player) - areaScore(a, player)
        // )
        // .slice(0, numberOfPlayers * 20);
        //
        // engine.emit('world:start-tiles', startingSquares);
        //
        // // TODO: this needs to be setting up right clients for each player
        // (clientRegistry.entries() as Client[]).forEach((client: Client): void => {
        //   const player = client.player();
        //
        //   client.chooseCivilization(civilizationRegistry.entries());
        //
        //   civilizationRegistry.unregister(
        //     player.civilization().constructor as typeof Civilization
        //   );
        //
        //   // TODO: configurable/Rule
        //   startingSquares = startingSquares.filter((tile: Tile): boolean =>
        //     usedStartSquares.every(
        //       (startSquare: Tile): boolean => startSquare.distanceFrom(tile) > 4
        //     )
        //   );
        //
        //   const startingSquare =
        //     startingSquares[
        //       Math.floor(startingSquares.length * randomNumberGenerator())
        //     ];
        //
        //   if (!startingSquare) {
        //     throw new TypeError(
        //       `base-player/Events/World/built: startingSquare is '${startingSquare}'.`
        //     );
        //   }
        //
        //   usedStartSquares.push(startingSquare);
        //
        //   new Settlers(null, player, startingSquare);
        //
        //   // ensure surrounding tiles are visible
        //   startingSquare.getSurroundingArea().forEach((tile: Tile): void => {
        //     engine.emit('tile:seen', tile, player);
        //   });
        // });
        //
        // engine.emit('game:start');
    })),
    new Built_1.default(new Effect_1.default((world) => {
        engine.emit('world:built', world);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map