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
  yieldRegistry?: YieldRegistry,
  randomNumberGenerator?: () => number
) => Built[] = (
  civilizationRegistry: CivilizationRegistry = civilizationRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  engine: Engine = engineInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  yieldRegistry: YieldRegistry = yieldRegistryInstance,
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
                  [Trade, 1],
                ],
                yieldRegistry.entries()
              )
            );
          }

          return cache.get(tile);
        };

      engine.emit('world:generate-start-tiles');

      const numberOfPlayers = engine.option('players', 5),
        usedStartSquares: Tile[] = [],
        dummyPlayer = new Player();

      // TODO: this could pick a large cluster of squares all next to each other resulting in a situation where not enough
      //  meet the criteria of having a distance of >4...
      let startingSquares = world
        .filter((tile: Tile): boolean => tile.isLand())
        .sort(
          (a: Tile, b: Tile): number =>
            tileScore(b, dummyPlayer) - tileScore(a, dummyPlayer)
        )
        .slice(0, numberOfPlayers * 20);

      engine.emit('world:start-tiles', startingSquares);

      // TODO: this needs to be setting up right clients for each player
      (clientRegistry.entries() as Client[]).forEach((client: Client): void => {
        const player = client.player();

        client.chooseCivilization(civilizationRegistry.entries());

        civilizationRegistry.unregister(
          player.civilization().constructor as typeof Civilization
        );

        // TODO: configurable/Rule
        startingSquares = startingSquares.filter((tile: Tile): boolean =>
          usedStartSquares.every(
            (startSquare: Tile): boolean => startSquare.distanceFrom(tile) > 4
          )
        );

        const startingSquare =
          startingSquares[
            Math.floor(startingSquares.length * randomNumberGenerator())
          ];

        if (!startingSquare) {
          throw new TypeError(
            `base-player/Events/World/built: startingSquare is '${startingSquare}'.`
          );
        }

        usedStartSquares.push(startingSquare);

        new Settlers(null, player, startingSquare);

        // ensure surrounding tiles are visible
        startingSquare.getSurroundingArea().forEach((tile: Tile): void => {
          engine.emit('tile:seen', tile, player);
        });
      });

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
