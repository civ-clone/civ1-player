import { describe, it } from 'mocha';
import { expect, spy, use } from 'chai';
import CurrentPlayerRegistry from '@civ-clone/core-player/CurrentPlayerRegistry';
import Defeated from '@civ-clone/core-player/Rules/Defeated';
import Engine from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import defeated from '../Rules/Player/defeated';
import * as spies from 'chai-spies';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import unitDestroyed from '../Rules/Unit/destroyed';
import cityDestroyed from '../Rules/City/destroyed';
import captured from '../Rules/City/captured';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import Effect from '@civ-clone/core-rule/Effect';

use(spies);

describe('Player.defeated', (): void => {
  it('should unregister the defeated Player from the `CurrentPlayerRegistry` and the `PlayerRegistry`', async (): Promise<void> => {
    const playerRegistry = new PlayerRegistry(),
      currentPlayerRegistry = new CurrentPlayerRegistry(),
      ruleRegistry = new RuleRegistry(),
      engine = new Engine(),
      player1 = new Player(ruleRegistry),
      player2 = new Player(ruleRegistry);

    spy.on(engine, ['emit']);

    playerRegistry.register(player1, player2);
    currentPlayerRegistry.register(...playerRegistry.entries());
    ruleRegistry.register(
      ...defeated(currentPlayerRegistry, playerRegistry, engine)
    );

    expect(playerRegistry.length).equal(2);
    expect(currentPlayerRegistry.length).equal(2);

    ruleRegistry.process(Defeated, player1, player2);

    expect(playerRegistry.length).equal(1);
    expect(currentPlayerRegistry.length).equal(1);
    expect(playerRegistry.entries()).not.include(player1);
    expect(currentPlayerRegistry.entries()).not.include(player1);
    expect(engine.emit).called();
  });

  it('should trigger checking `Defeated` `Rule` when losing a `Unit` or `City` (either captured or destroyed)', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      cityRegistry = new CityRegistry(),
      city = await setUpCity({ ruleRegistry }),
      enemy = new Player(),
      unit = new Unit(
        null,
        city.player(),
        city.tile().getNeighbour('e'),
        ruleRegistry
      ),
      defeatedEffect = spy();

    ruleRegistry.register(
      ...unitDestroyed(cityRegistry, ruleRegistry),
      ...cityDestroyed(cityRegistry, ruleRegistry),
      ...captured(cityRegistry, ruleRegistry),
      new Defeated(new Effect(defeatedEffect))
    );

    cityRegistry.register(city);
    city.destroy();
    city.capture(enemy);
    cityRegistry.unregister(city);
    unit.destroy(enemy);

    expect(defeatedEffect).nth(1).called.with.exactly(city.player(), null);
    expect(defeatedEffect).nth(2).called.with.exactly(city.player(), enemy);
    expect(defeatedEffect).nth(3).called.with.exactly(city.player(), enemy);
    expect(defeatedEffect).called.exactly(3);
  });
});
