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
import { Food, Production, Trade } from '@civ-clone/civ1-world/Yields';
import { Grassland, Plains, River } from '@civ-clone/civ1-world/Terrains';
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
import Client from '@civ-clone/core-civ-client/Client';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Tile from '@civ-clone/core-world/Tile';
import { Worker } from 'worker_threads';
import World from '@civ-clone/core-world/World';

export const getRules: (
  civilizationRegistry?: CivilizationRegistry,
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  randomNumberGenerator?: () => number
) => Built[] = (
  civilizationRegistry: CivilizationRegistry = civilizationRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  engine: Engine = engineInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  randomNumberGenerator: () => number = (): number => Math.random()
): Built[] => [
  new Built(
    new Effect((world: World): void =>
      playerRegistry
        .entries()
        .forEach((player: Player): void =>
          playerWorldRegistry.register(new PlayerWorld(player, world))
        )
    )
  ),
  new Built(
    new Effect((world: World): void => {
      const tileCache: Map<Tile, number> = new Map(),
        areaCache: Map<Tile, number> = new Map(),
        tileScore = (tile: Tile, player: Player): number => {
          if (!tileCache.has(tile)) {
            tileCache.set(
              tile,
              tile.score(player, [
                [Food, 4],
                [Production, 2],
                [Trade, 1],
              ])
            );
          }

          return tileCache.get(tile) as number;
        },
        areaScore = (tile: Tile, player: Player): number => {
          if (!areaCache.has(tile)) {
            areaCache.set(
              tile,
              tile
                .getSurroundingArea()
                .entries()
                .reduce(
                  (total: number, tile: Tile): number =>
                    total + tileScore(tile, player),
                  0
                )
            );
          }

          return areaCache.get(tile) as number;
        };

      engine.emit('world:generate-start-tiles');

      const numberOfPlayers = engine.option('players', 5),
        usedStartSquares: Tile[] = [],
        [player] = playerRegistry.entries(),
        worker = new Worker(__dirname + '/sortStartTiles.js', {
          workerData: {
            numberOfRequiredTiles: numberOfPlayers * 20,
            // This still takes a little while to process, but doesn't lock the main thread for as long...
            tiles: world
              .entries()
              .filter((tile: Tile) =>
                [Grassland, Plains, River].some(
                  (TerrainType) => tile.terrain() instanceof TerrainType
                )
              )
              .map((tile: Tile) => ({
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
      worker.on('message', (startSquares: { x: number; y: number }[]) => {
        const startingSquares = startSquares.map(
          ({ x, y }): Tile => world.get(x, y)
        );

        engine.emit('world:start-tiles', startingSquares);

        // TODO: this needs to be setting up right clients for each player
        (clientRegistry.entries() as Client[])
          .reduce(
            (promise: Promise<void>, client: Client): Promise<void> =>
              promise.then(async () => {
                const player = client.player();

                await client.chooseCivilization(civilizationRegistry.entries());

                civilizationRegistry.unregister(
                  player.civilization().constructor as typeof Civilization
                );

                // TODO: configurable/Rule?
                startingSquares
                  .filter((tile: Tile): boolean =>
                    usedStartSquares.some(
                      (startSquare: Tile): boolean =>
                        startSquare.distanceFrom(tile) <= 4
                    )
                  )
                  .forEach((tile) =>
                    startingSquares.splice(startingSquares.indexOf(tile), 1)
                  );

                const startingSquare =
                  startingSquares[
                    Math.floor(startingSquares.length * randomNumberGenerator())
                  ];

                if (!startingSquare) {
                  throw new TypeError('Not enough `startingSquare`s.');
                }

                usedStartSquares.push(startingSquare);

                // TODO: have this `Rule` controlled
                new Settlers(null, player, startingSquare);

                // ensure surrounding tiles are visible
                startingSquare
                  .getSurroundingArea()
                  .forEach((tile: Tile): void => {
                    engine.emit('tile:seen', tile, player);
                  });
              }),
            Promise.resolve()
          )
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
    })
  ),
  new Built(
    new Effect((world: World): void => {
      engine.emit('world:built', world);
    })
  ),
];

export default getRules;
