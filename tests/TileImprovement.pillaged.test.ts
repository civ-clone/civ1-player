import { describe, it } from 'mocha';
import { expect, spy, use } from 'chai';
import FillGenerator from '@civ-clone/simple-world-generator/tests/lib/FillGenerator';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Pillaged from '@civ-clone/core-tile-improvement/Rules/Pillaged';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import World from '@civ-clone/core-world/World';
import pillaged from '../Rules/TileImprovement/pillaged';
import * as spies from 'chai-spies';

use(spies);

describe('TileImprovement.pillaged', () => {
  it('should clear yield cache for `Tile`s registered in the `PlayerWorld`', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      playerRegistry = new PlayerRegistry(),
      playerWorldRegistry = new PlayerWorldRegistry(),
      world = await new World(new FillGenerator(1, 1)).build(ruleRegistry),
      tile = world.get(0, 0),
      player = new Player(ruleRegistry),
      playerWorld = new PlayerWorld(player, world, ruleRegistry),
      improvement = new TileImprovement(tile, ruleRegistry);

    ruleRegistry.register(...pillaged(playerRegistry, playerWorldRegistry));
    playerRegistry.register(player);
    playerWorldRegistry.register(playerWorld);

    spy.on(tile, 'clearYieldCache');

    ruleRegistry.process(Pillaged, tile, improvement);

    expect(tile.clearYieldCache).called.exactly(1);
    expect(tile.clearYieldCache).nth(1).called.with.exactly(null);

    playerWorld.register(tile);

    ruleRegistry.process(Pillaged, tile, improvement);

    expect(tile.clearYieldCache).called.exactly(3);
    expect(tile.clearYieldCache).nth(2).called.with.exactly(null);
    expect(tile.clearYieldCache).nth(3).called.with.exactly(player);
  });
});
