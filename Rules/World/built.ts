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
import Effect from '@civ-clone/core-rule/Effect';
import Food from '@civ-clone/base-terrain-yield-food/Food';
import Grassland from '@civ-clone/base-terrain-grassland/Grassland';
import Plains from '@civ-clone/base-terrain-plains/Plains';
import Player from '@civ-clone/core-player/Player';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import River from '@civ-clone/base-terrain-river/River';
import Trade from '@civ-clone/base-terrain-yield-trade/Trade';
import World from '@civ-clone/core-world/World';
import rankStartTiles from '@civ-clone/base-player/lib/startTiles';
import seatPlayers from '@civ-clone/base-player/lib/seatPlayers';

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
    'civ1-player:world/built/register-player-worlds',
    new Effect((world: World): void =>
      playerRegistry
        .entries()
        .forEach((player: Player): void =>
          playerWorldRegistry.register(new PlayerWorld(player, world))
        )
    )
  ),
  new Built(
    'civ1-player:world/built/choose-start-tiles',
    new Effect((world: World): void => {
      engine.emit('world:generate-start-tiles');

      // Where Civilization's players may start: grassland, plains or river, ranked by the area around each, with food
      //  weighted 8, shields 3 and trade 1.
      const startingSquares = rankStartTiles(
        world,
        [Grassland, Plains, River],
        [
          [Food, 8],
          [Production, 3],
          [Trade, 1],
        ]
      );

      engine.emit('world:start-tiles', startingSquares);

      seatPlayers(
        world,
        clientRegistry,
        civilizationRegistry,
        leaderRegistry,
        attributeRegistry,
        cityNameRegistry,
        traitRegistry,
        ruleRegistry
      ).then(() => engine.emit('game:start'));
    })
  ),
  new Built(
    'civ1-player:world/built/emit',
    new Effect((world: World): void => {
      engine.emit('world:built', world);
    })
  ),
];

export default getRules;
