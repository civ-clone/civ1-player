import { describe, it } from 'mocha';
import Babylonian from '@civ-clone/base-civilization-babylonian/Babylonian';
import Built from '@civ-clone/core-world/Rules/Built';
import CivilizationRegistry from '@civ-clone/core-civilization/CivilizationRegistry';
import Client from '@civ-clone/core-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import Created from '@civ-clone/core-unit/Rules/Created';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Generator from './lib/Generator';
import Hammurabi from '@civ-clone/base-civilization-babylonian/Leaders/Hammurabi';
import LeaderRegistry from '@civ-clone/core-civilization/LeaderRegistry';
import PickStartTile from '@civ-clone/core-world-generator/Rules/PickStartTile';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import River from '@civ-clone/base-terrain-river/River';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Shield from '@civ-clone/base-terrain-feature-shield/Shield';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import World from '@civ-clone/core-world/World';
import built from '../Rules/World/built';
import { expect } from 'chai';
import spawn from '../Rules/Player/spawn';

describe('World.built', () => {
  it('should pick appropriate `Civilization`s, `Leader`s, `Unit`s and start `Tile`s for `Player`s', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      civilizationRegistry = new CivilizationRegistry(),
      clientRegistry = new ClientRegistry(),
      engine = new Engine(),
      playerRegistry = new PlayerRegistry(),
      playerWorldRegistry = new PlayerWorldRegistry(),
      terrainFeatureRegistry = new TerrainFeatureRegistry(),
      unitRegistry = new UnitRegistry(),
      worldBuilt: Promise<void> = new Promise((resolve) =>
        engine.on('game:start', resolve)
      ),
      world = new World(
        new Generator(10, 10, () => {
          const terrain = new River(ruleRegistry);

          terrainFeatureRegistry.register(new Shield(terrain));

          return terrain;
        }),
        ruleRegistry
      ),
      leaderRegistry = new LeaderRegistry(),
      player = new Player(ruleRegistry),
      client = new Client(player, () => 0);

    ruleRegistry.register(
      new Created(new Effect((unit) => unitRegistry.register(unit))),
      ...built(
        civilizationRegistry,
        clientRegistry,
        engine,
        playerRegistry,
        playerWorldRegistry,
        ruleRegistry,
        leaderRegistry
      ),
      ...spawn(ruleRegistry),
      new PickStartTile(
        new Effect((world, player, usedTiles) => {
          const available = world
            .entries()
            .filter((tile) => !usedTiles.includes(tile));

          return available[Math.floor(Math.random() * available.length)];
        })
      )
    );

    civilizationRegistry.register(Babylonian);
    clientRegistry.register(client);
    playerRegistry.register(player);
    playerWorldRegistry.register(new PlayerWorld(player, world, ruleRegistry));
    leaderRegistry.register(Hammurabi);

    await world.build();

    await worldBuilt;

    expect(player.civilization()).instanceof(Babylonian);
    expect(player.civilization().leader()).instanceof(Hammurabi);
    expect(unitRegistry.getByPlayer(client.player())).length(1);

    const [unit] = unitRegistry.getByPlayer(client.player());

    expect(unit).instanceof(Settlers);
  });
});
