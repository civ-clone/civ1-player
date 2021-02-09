import {
  CivilizationRegistry,
  instance as civilizationRegistryInstance,
} from '@civ-clone/core-civilization/CivilizationRegistry';
import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import { Food, Production } from '@civ-clone/civ1-world/Yields';
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
import Civilization from '@civ-clone/core-civilization/Civilization';
import Client from '@civ-clone/core-client/Client';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Tile from '@civ-clone/core-world/Tile';
import World from '@civ-clone/core-world/World';
import YieldRegistry, {
  instance as yieldRegistryInstance,
} from '@civ-clone/core-yield/YieldRegistry';

export const getRules: (
  civilizationRegistry?: CivilizationRegistry,
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  yieldRegistry?: YieldRegistry
) => Built[] = (
  civilizationRegistry: CivilizationRegistry = civilizationRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  engine: Engine = engineInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  yieldRegistry: YieldRegistry = yieldRegistryInstance
): Built[] => [
  new Built(
    new Effect((world: World): void => {
      const cache = new Map(),
        tileScore = (tile: Tile, player: Player): number => {
          if (!cache.has(tile)) {
            cache.set(
              tile,
              tile.getSurroundingArea().score(
                player,
                [
                  [Food, 4],
                  [Production, 2],
                ],
                yieldRegistry.entries()
              )
            );
          }

          return cache.get(tile);
        },
        setUpPlayer = (ClientType: typeof Client): void => {
          // TODO: this could be a set of rules
          const player = new Player(),
            client = new ClientType(player),
            playerWorld = new PlayerWorld(player, world);

          playerWorldRegistry.register(playerWorld);
          clientRegistry.register(client);

          // TODO
          // client.chooseCivilization(availableCivilizations);
          const RandomCivilization: typeof Civilization =
            availableCivilizations[
              Math.floor(Math.random() * availableCivilizations.length)
            ];

          player.setCivilization(new RandomCivilization());
          availableCivilizations = availableCivilizations.filter(
            (CivilizationType: typeof Civilization): boolean =>
              !(player.civilization() instanceof CivilizationType)
          );

          startingSquares = startingSquares
            .filter((tile: Tile): boolean => !usedStartSquares.includes(tile))
            .filter((tile: Tile): boolean =>
              usedStartSquares.every(
                (startSquare: Tile): boolean =>
                  startSquare.distanceFrom(tile) > 4
              )
            );

          const startingSquare =
            startingSquares[Math.floor(startingSquares.length * Math.random())];

          if (!startingSquare) {
            throw new TypeError(
              `base-player/Events/World/built: startingSquare is '${startingSquare}'.`
            );
          }

          usedStartSquares.push(startingSquare);

          playerRegistry.register(player);

          new Settlers(null, player, startingSquare);

          // ensure surrounding tiles are visible
          startingSquare.getSurroundingArea().forEach((tile: Tile): void => {
            engine.emit('tile:seen', tile, player);
          });
        };

      engine.emit('world:generate-start-tiles');

      const numberOfPlayers = engine.option('players', 5),
        usedStartSquares: Tile[] = [],
        dummyPlayer = new Player();

      let startingSquares = world
        .filter((tile: Tile): boolean => tile.isLand())
        .sort(
          (a: Tile, b: Tile): number =>
            tileScore(b, dummyPlayer) - tileScore(a, dummyPlayer)
        )
        .slice(0, numberOfPlayers * 20);

      engine.emit('world:start-tiles', startingSquares);

      let availableCivilizations = civilizationRegistry.entries();

      // TODO: this needs to be setting up right clients for each player
      while (playerRegistry.length < numberOfPlayers) {
        // setUpPlayer(SimpleAIClient);
      }

      engine.emit('game:start');
    })
  ),
  new Built(
    new Effect((world: World): void => {
      engine.emit('world:built', world);
    })
  ),
];

export default getRules;
