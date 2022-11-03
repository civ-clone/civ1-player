import { expect, spy, use } from 'chai';
import Engine from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import added from '../Rules/Player/added';
import { describe } from 'mocha';
import * as spies from 'chai-spies';

use(spies);

describe('Player.added', () => {
  it('should trigger an event', () => {
    const ruleRegistry = new RuleRegistry(),
      engine = new Engine();

    spy.on(engine, ['emit']);

    ruleRegistry.register(...added(engine));

    const player = new Player(ruleRegistry);

    expect(engine.emit).called.with.exactly('player:added', player);
  });
});
