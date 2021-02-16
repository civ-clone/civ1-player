"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CivilizationRegistry_1 = require("@civ-clone/core-civilization/CivilizationRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Yields_1 = require("@civ-clone/civ1-world/Yields");
const PlayerRegistry_1 = require("@civ-clone/core-player/PlayerRegistry");
const PlayerWorldRegistry_1 = require("@civ-clone/core-player-world/PlayerWorldRegistry");
const Built_1 = require("@civ-clone/core-world/Rules/Built");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Player_1 = require("@civ-clone/core-player/Player");
const PlayerWorld_1 = require("@civ-clone/core-player-world/PlayerWorld");
const Settlers_1 = require("@civ-clone/base-unit-settlers/Settlers");
const YieldRegistry_1 = require("@civ-clone/core-yield/YieldRegistry");
const getRules = (civilizationRegistry = CivilizationRegistry_1.instance, clientRegistry = ClientRegistry_1.instance, engine = Engine_1.instance, playerRegistry = PlayerRegistry_1.instance, playerWorldRegistry = PlayerWorldRegistry_1.instance, yieldRegistry = YieldRegistry_1.instance, randomNumberGenerator = () => Math.random()) => [
    new Built_1.default(new Effect_1.default((world) => playerRegistry.entries()
        .forEach((player) => playerWorldRegistry.register(new PlayerWorld_1.default(player, world))))),
    new Built_1.default(new Effect_1.default((world) => {
        const cache = new Map(), tileScore = (tile, player) => {
            if (!cache.has(tile)) {
                cache.set(tile, tile.getSurroundingArea().score(player, [
                    [Yields_1.Food, 4],
                    [Yields_1.Production, 2],
                    [Yields_1.Trade, 1]
                ], yieldRegistry.entries()));
            }
            return cache.get(tile);
        };
        engine.emit('world:generate-start-tiles');
        const numberOfPlayers = engine.option('players', 5), usedStartSquares = [], dummyPlayer = new Player_1.default();
        // TODO: this could pick a large cluster of squares all next to each other resulting in a situation where not enough
        //  meet the criteria of having a distance of >4...
        let startingSquares = world
            .filter((tile) => tile.isLand())
            .sort((a, b) => tileScore(b, dummyPlayer) - tileScore(a, dummyPlayer))
            .slice(0, numberOfPlayers * 20);
        engine.emit('world:start-tiles', startingSquares);
        // TODO: this needs to be setting up right clients for each player
        clientRegistry.entries().forEach((client) => {
            const player = client.player();
            client.chooseCivilization(civilizationRegistry.entries());
            civilizationRegistry.unregister(player.civilization().constructor);
            // TODO: configurable/Rule
            startingSquares = startingSquares
                .filter((tile) => usedStartSquares.every((startSquare) => startSquare.distanceFrom(tile) > 4));
            const startingSquare = startingSquares[Math.floor(startingSquares.length * randomNumberGenerator())];
            if (!startingSquare) {
                throw new TypeError(`base-player/Events/World/built: startingSquare is '${startingSquare}'.`);
            }
            usedStartSquares.push(startingSquare);
            new Settlers_1.default(null, player, startingSquare);
            // ensure surrounding tiles are visible
            startingSquare.getSurroundingArea().forEach((tile) => {
                engine.emit('tile:seen', tile, player);
            });
        });
        engine.emit('game:start');
    })),
    new Built_1.default(new Effect_1.default((world) => {
        engine.emit('world:built', world);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=built.js.map