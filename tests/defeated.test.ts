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
import Client from '@civ-clone/core-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';

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
      ...defeated(
        currentPlayerRegistry,
        playerRegistry,
        ruleRegistry,
        undefined,
        engine
      )
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
      defeatedEffect = spy(),
      // Captured before the city changes hands. `city.player()` read at
      // assertion time is the *enemy*, because `city.capture(enemy)` below
      // reassigns it. This passed for years anyway: with `#private` fields two
      // `Player`s had no enumerable state, so deep equality could not tell the
      // defeated player from the one who defeated them. Stage 1 made `_id`
      // enumerable and the assertion started meaning something.
      player = city.player();

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

    expect(defeatedEffect).nth(1).called.with.exactly(player, null);
    expect(defeatedEffect).nth(2).called.with.exactly(player, enemy);
    expect(defeatedEffect).nth(3).called.with.exactly(player, enemy);
    expect(defeatedEffect).called.exactly(3);
  });

  describe('the human', (): void => {
    // A city of the human's, a Settlers unit (or a Warriors-like one) of theirs elsewhere, and the rules that decide
    //  whether losing either defeats them.
    const setUp = async (UnitType: typeof Unit, human: boolean = true) => {
      const ruleRegistry = new RuleRegistry(),
        cityRegistry = new CityRegistry(),
        unitRegistry = new UnitRegistry(),
        clientRegistry = new ClientRegistry(),
        city = await setUpCity({ ruleRegistry }),
        player = city.player(),
        enemy = new Player(ruleRegistry),
        unit = new UnitType(
          null,
          player,
          city.tile().getNeighbour('e'),
          ruleRegistry
        ),
        defeatedEffect = spy();

      if (human) {
        clientRegistry.register(new Client(player));
      }

      cityRegistry.register(city);
      unitRegistry.register(unit);

      ruleRegistry.register(
        ...unitDestroyed(
          cityRegistry,
          ruleRegistry,
          unitRegistry,
          clientRegistry
        ),
        ...cityDestroyed(
          cityRegistry,
          ruleRegistry,
          unitRegistry,
          clientRegistry
        ),
        ...captured(cityRegistry, ruleRegistry, unitRegistry, clientRegistry),
        new Defeated(new Effect(defeatedEffect))
      );

      return { city, cityRegistry, defeatedEffect, enemy, player, unit };
    };

    it('is not defeated losing their last city while they have a Settlers', async (): Promise<void> => {
      const { city, defeatedEffect, enemy } = await setUp(Settlers);

      city.capture(enemy);

      expect(defeatedEffect).not.called();
    });

    it('is defeated losing their last Settlers with no cities', async (): Promise<void> => {
      const { city, cityRegistry, defeatedEffect, enemy, player, unit } =
        await setUp(Settlers);

      city.destroy();
      cityRegistry.unregister(city);

      expect(defeatedEffect).not.called();

      unit.destroy(enemy);

      expect(defeatedEffect).called.once.with.exactly(player, enemy);
    });

    it('is defeated losing their last city with no Settlers', async (): Promise<void> => {
      const { city, defeatedEffect, enemy, player } = await setUp(Unit);

      city.capture(enemy);

      expect(defeatedEffect).called.once.with.exactly(player, enemy);
    });

    it('leaves a computer player defeated at no cities, Settlers or not', async (): Promise<void> => {
      const { city, defeatedEffect, enemy, player } = await setUp(
        Settlers,
        false
      );

      city.capture(enemy);

      expect(defeatedEffect).called.once.with.exactly(player, enemy);
    });
  });
});
