import { describe, it } from 'mocha';
import { expect, spy, use } from 'chai';
import FillGenerator from '@civ-clone/simple-world-generator/tests/lib/FillGenerator';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Removed from '@civ-clone/core-tile-improvement/Rules/Removed';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import World from '@civ-clone/core-world/World';
import removed from '../Rules/TileImprovement/removed';
import * as spies from 'chai-spies';

use(spies);

describe('TileImprovement.removed', () => {
  it('should clear yield cache for `Tile`s registered in the `PlayerWorld`', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      playerRegistry = new PlayerRegistry(),
      playerWorldRegistry = new PlayerWorldRegistry(),
      world = await new World(new FillGenerator(1, 1)).build(ruleRegistry),
      tile = world.get(0, 0),
      player = new Player(ruleRegistry),
      playerWorld = new PlayerWorld(player, world, ruleRegistry),
      improvement = new TileImprovement(tile, ruleRegistry);

    ruleRegistry.register(...removed(playerRegistry, playerWorldRegistry));
    playerRegistry.register(player);
    playerWorldRegistry.register(playerWorld);

    spy.on(tile, 'clearYieldCache');

    ruleRegistry.process(Removed, tile, improvement);

    expect(tile.clearYieldCache).called.exactly(1);
    expect(tile.clearYieldCache).nth(1).called.with.exactly(null);

    playerWorld.register(tile);

    ruleRegistry.process(Removed, tile, improvement);

    expect(tile.clearYieldCache).called.exactly(3);
    expect(tile.clearYieldCache).nth(2).called.with.exactly(null);
    expect(tile.clearYieldCache).nth(3).called.with.exactly(player);
  });
});
