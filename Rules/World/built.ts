import {
  AttributeRegistry,
  instance as attributeRegistryInstance,
} from '@civ-clone/core-civilization/AttributeRegistry';
import {
  CityNameRegistry,
  instance as cityNameRegistryInstance,
} from '@civ-clone/core-civilization/CityNameRegistry';
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
  LeaderRegistry,
  instance as leaderRegistryInstance,
} from '@civ-clone/core-civilization/LeaderRegistry';
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
import {
  TraitRegistry,
  instance as traitRegistryInstance,
} from '@civ-clone/core-civilization/TraitRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
import ChoiceMeta from '@civ-clone/core-client/ChoiceMeta';
import Client from '@civ-clone/core-client/Client';
import Effect from '@civ-clone/core-rule/Effect';
import Food from '@civ-clone/base-terrain-yield-food/Food';
import Grassland from '@civ-clone/base-terrain-grassland/Grassland';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Plains from '@civ-clone/base-terrain-plains/Plains';
import Player from '@civ-clone/core-player/Player';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import River from '@civ-clone/base-terrain-river/River';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
import Tile from '@civ-clone/core-world/Tile';
import Trade from '@civ-clone/base-terrain-yield-trade/Trade';
import World from '@civ-clone/core-world/World';

export const getRules = (
  civilizationRegistry: CivilizationRegistry = civilizationRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance,
  engine: Engine = engineInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  playerWorldRegistry: PlayerWorldRegistry = playerWorldRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  leaderRegistry: LeaderRegistry = leaderRegistryInstance,
  attributeRegistry: AttributeRegistry = attributeRegistryInstance,
  cityNameRegistry: CityNameRegistry = cityNameRegistryInstance,
  traitRegistry: TraitRegistry = traitRegistryInstance
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

      const usedStartSquares: Tile[] = [],
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

      (clientRegistry.entries() as Client[])
        .reduce(
          (promise: Promise<void>, client: Client): Promise<void> =>
            promise.then(async () => {
              const player = client.player(),
                CivilizationChoice = await client.chooseFromList(
                  new ChoiceMeta(
                    civilizationRegistry.entries(),
                    'choose-civilization'
                  )
                ),
                civilization = new CivilizationChoice(
                  attributeRegistry,
                  cityNameRegistry
                );

              player.setCivilization(civilization);

              const LeaderChoice = await client.chooseFromList(
                  new ChoiceMeta(
                    leaderRegistry.getByCivilization(
                      civilization.sourceClass()
                    ),
                    'choose-leader'
                  )
                ),
                leader = new LeaderChoice(traitRegistry);

              civilization.setLeader(leader);

              civilizationRegistry.unregister(civilization.sourceClass());

              leaderRegistry.unregister(leader.sourceClass());

              const [startingSquare] = ruleRegistry.process(
                PickStartTile,
                world,
                player,
                usedStartSquares
              );

              if (!startingSquare) {
                throw new TypeError('Not enough `startingSquare`s.');
              }

              usedStartSquares.push(startingSquare);

              ruleRegistry.process(Spawn, player, startingSquare);
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
