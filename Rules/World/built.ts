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
import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
import Client from '@civ-clone/core-civ-client/Client';
import Effect from '@civ-clone/core-rule/Effect';
import Food from '@civ-clone/base-terrain-yield-food/Food';
import Grassland from '@civ-clone/base-terrain-grassland/Grassland';
import Plains from '@civ-clone/base-terrain-plains/Plains';
import Player from '@civ-clone/core-player/Player';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import River from '@civ-clone/base-terrain-river/River';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Tile from '@civ-clone/core-world/Tile';
import Trade from '@civ-clone/base-terrain-yield-trade/Trade';
import World from '@civ-clone/core-world/World';

export const getRules: (
  civilizationRegistry?: CivilizationRegistry,
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  ruleRegistry?: RuleRegistry,
  randomNumberGenerator?: () => number
) => Built[] = (
  civilizationRegistry: CivilizationRegistry = civilizationRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  engine: Engine = engineInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
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
        tileScore = (tile: Tile, player: Player | null = null): number => {
          if (!tileCache.has(tile)) {
            tileCache.set(
              tile,
              tile.score(player, [
                [Food, 8],
                [Production, 3],
                [Trade, 1],
              ])
            );
          }

          return tileCache.get(tile)!;
        },
        areaScore = (tile: Tile, player: Player | null = null): number => {
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

          return areaCache.get(tile)!;
        };

      engine.emit('world:generate-start-tiles');

      const numberOfPlayers = engine.option('players', 5),
        usedStartSquares: Tile[] = [],
        startingSquares = world
          .entries()
          .filter((tile: Tile) =>
            [Grassland, Plains, River].some(
              (TerrainType) => tile.terrain() instanceof TerrainType
            )
          )
          .map((tile: Tile) => ({
            tile,
            score: areaScore(tile),
          }))
          .sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)
          .map(({ tile }) => tile);

      engine.emit('world:start-tiles', startingSquares);

      // TODO: this needs to be setting up right clients for each player
      (clientRegistry.entries() as Client[])
        .reduce(
          (promise: Promise<void>, client: Client): Promise<void> =>
            promise.then(async () => {
              const player = client.player();

              await client.chooseCivilization(civilizationRegistry.entries());

              civilizationRegistry.unregister(
                player.civilization().sourceClass()
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
              new Settlers(null, player, startingSquare, ruleRegistry);
            }),
          Promise.resolve()
        )
        .then(() => engine.emit('game:start'));
    })
  ),
  new Built(
    new Effect((world: World): void => {
      engine.emit('world:built', world);
    })
  ),
];

export default getRules;
