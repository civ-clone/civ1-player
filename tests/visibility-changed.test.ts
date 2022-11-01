import { expect, spy, use } from 'chai';
import Engine from '@civ-clone/core-engine/Engine';
import FillGenerator from '@civ-clone/simple-world-generator/tests/lib/FillGenerator';
import Player from '@civ-clone/core-player/Player';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import World from '@civ-clone/core-world/World';
import visibilityChanged from '../Rules/Player/visibility-changed';
import { describe } from 'mocha';
import * as spies from 'chai-spies';
import Unit from '@civ-clone/core-unit/Unit';
import { unitYield } from '@civ-clone/core-unit/Rules/Yield';
import visibility from '../Rules/Unit/visibility';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';

use(spies);

describe('Player.visibility-changed', () => {
  it('should trigger an event', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      playerWorldRegistry = new PlayerWorldRegistry(),
      world = await new World(new FillGenerator(5, 5)).build(ruleRegistry),
      tile = world.get(1, 1),
      player = new Player(ruleRegistry),
      unit = new Unit(null, player, tile, ruleRegistry),
      playerWorld = new PlayerWorld(player, world, ruleRegistry),
      engine = new Engine();

    spy.on(engine, ['emit']);

    ruleRegistry.register(
      ...visibility(playerWorldRegistry),
      ...visibilityChanged(engine),
      ...unitYield(Unit, 1, 1, 1, 1)
    );

    playerWorldRegistry.register(playerWorld);

    unit.applyVisibility();

    expect(playerWorld.entries()).length(9);

    tile.getSurroundingArea(1).forEach((tile, i) =>
      expect(engine.emit)
        .nth(i + 1)
        .called.with.exactly(
          'player:visibility-changed',
          tile,
          playerWorld.player()
        )
    );
  });
});
