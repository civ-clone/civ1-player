import { describe, it } from 'mocha';
import Babylonian from '@civ-clone/base-civilization-babylonian/Babylonian';
import Built from '@civ-clone/core-world/Rules/Built';
import CivilizationRegistry from '@civ-clone/core-civilization/CivilizationRegistry';
import Client from '@civ-clone/core-civ-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import Created from '@civ-clone/core-unit/Rules/Created';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Generator from './lib/Generator';
import Hammurabi from '@civ-clone/base-civilization-babylonian/Leaders/Hammurabi';
import LeaderRegistry from '@civ-clone/core-civilization/LeaderRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import River from '@civ-clone/base-terrain-river/River';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Shield from '@civ-clone/base-terrain-feature-shield/Shield';
import TerrainFeatureRegistry from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import World from '@civ-clone/core-world/World';
import built from '../Rules/World/built';
import { expect } from 'chai';

describe('World.built', () => {
  it('should pick appropriate start `Tile`s for `Player`s', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      civilizationRegistry = new CivilizationRegistry(),
      clientRegistry = new ClientRegistry(),
      engine = new Engine(),
      playerRegistry = new PlayerRegistry(),
      playerWorldRegistry = new PlayerWorldRegistry(),
      terrainFeatureRegistry = new TerrainFeatureRegistry(),
      unitRegistry = new UnitRegistry(),
      worldBuilt: Promise<void> = new Promise((resolve) => {
        ruleRegistry.register(
          new Built(
            new Effect((world) => {
              engine.on('game:start', resolve);

              return world;
            })
          )
        );
      }),
      world = new World(
        new Generator(10, 10, () => {
          const terrain = new River(ruleRegistry);

          terrainFeatureRegistry.register(new Shield(terrain));

          return terrain;
        }),
        ruleRegistry
      ),
      leaderRegistry = new LeaderRegistry(),
      client = new Client(new Player(ruleRegistry), leaderRegistry, () => 0);

    ruleRegistry.register(
      new Created(new Effect((unit) => unitRegistry.register(unit))),
      ...built(
        civilizationRegistry,
        clientRegistry,
        engine,
        playerRegistry,
        playerWorldRegistry,
        ruleRegistry,
        () => 0
      )
    );

    civilizationRegistry.register(Babylonian);
    clientRegistry.register(client);
    playerRegistry.register(client.player());
    playerWorldRegistry.register(
      new PlayerWorld(client.player(), world, ruleRegistry)
    );
    leaderRegistry.register(Hammurabi);

    world.build();

    await worldBuilt;

    expect(unitRegistry.getByPlayer(client.player())).length(1);

    const [unit] = unitRegistry.getByPlayer(client.player());
  });
});
