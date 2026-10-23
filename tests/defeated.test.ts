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
import Captured from '@civ-clone/core-city/Rules/Captured';
import CityDestroyed from '@civ-clone/core-city/Rules/Destroyed';
import High from '@civ-clone/core-rule/Priorities/High';
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
      playerRegistry = new PlayerRegistry(),
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
      ...unitDestroyed(
        cityRegistry,
        ruleRegistry,
        undefined,
        undefined,
        playerRegistry
      ),
      ...cityDestroyed(
        cityRegistry,
        ruleRegistry,
        undefined,
        undefined,
        playerRegistry
      ),
      ...captured(
        cityRegistry,
        ruleRegistry,
        undefined,
        undefined,
        playerRegistry
      ),
      new Defeated(new Effect(defeatedEffect))
    );

    playerRegistry.register(player);
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
        playerRegistry = new PlayerRegistry(),
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

      playerRegistry.register(player);
      cityRegistry.register(city);
      unitRegistry.register(unit);

      ruleRegistry.register(
        ...unitDestroyed(
          cityRegistry,
          ruleRegistry,
          unitRegistry,
          clientRegistry,
          playerRegistry
        ),
        ...cityDestroyed(
          cityRegistry,
          ruleRegistry,
          unitRegistry,
          clientRegistry,
          playerRegistry
        ),
        ...captured(
          cityRegistry,
          ruleRegistry,
          unitRegistry,
          clientRegistry,
          playerRegistry
        ),
        new Defeated(new Effect(defeatedEffect))
      );

      return {
        city,
        cityRegistry,
        defeatedEffect,
        enemy,
        player,
        playerRegistry,
        ruleRegistry,
        unit,
        unitRegistry,
      };
    };

    it('is defeated once when losing their last city disbands the units it supported (civ-clone/web-renderer#600)', async (): Promise<void> => {
      const {
        city,
        defeatedEffect,
        enemy,
        player,
        playerRegistry,
        ruleRegistry,
        unit,
        unitRegistry,
      } = await setUp(Unit, false);

      // The rules that take a defeated player out of the game, which the triggers then see.
      ruleRegistry.register(
        ...defeated(
          new CurrentPlayerRegistry(),
          playerRegistry,
          ruleRegistry,
          unitRegistry
        )
      );

      const other = new Unit(
        null,
        player,
        city.tile().getNeighbour('w'),
        ruleRegistry
      );

      unitRegistry.register(other);

      // As civ1-city's `city/captured/destroy-supported-units` does, registered ahead of the rule that defeats the
      //  player on losing their last city, as civ1-city's rules are: the city changes hands, then each unit it
      //  supported is disbanded.
      ruleRegistry.register(
        new Captured(
          new High(),
          new Effect((): void => {
            unit.destroy();
            other.destroy();
          })
        )
      );

      city.capture(enemy);

      // The first unit's disbanding defeats the player, and civ1-city passes no player for that; the capture no longer does.
      expect(defeatedEffect).called.once.with.exactly(player, null);
      expect(playerRegistry.entries()).not.include(player);
    });

    it('is defeated once when losing their last city to destruction disbands the units it supported', async (): Promise<void> => {
      const {
        city,
        defeatedEffect,
        enemy,
        player,
        playerRegistry,
        ruleRegistry,
        unit,
        unitRegistry,
      } = await setUp(Unit, false);

      ruleRegistry.register(
        ...defeated(
          new CurrentPlayerRegistry(),
          playerRegistry,
          ruleRegistry,
          unitRegistry
        )
      );

      const other = new Unit(
        null,
        player,
        city.tile().getNeighbour('w'),
        ruleRegistry
      );

      unitRegistry.register(other);

      // As civ1-city's `city/destroyed/destroy-supported-units` does, ahead of the rule that defeats the player.
      ruleRegistry.register(
        new CityDestroyed(
          new High(),
          new Effect((): void => {
            unit.destroy();
            other.destroy();
          })
        )
      );

      city.destroy(enemy);

      expect(defeatedEffect).called.once.with.exactly(player, null);
      expect(playerRegistry.entries()).not.include(player);
    });

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

    it('keeps a player with no cities yet, but a Settlers, in the game when it loses a unit', async (): Promise<void> => {
      const {
        city,
        cityRegistry,
        defeatedEffect,
        enemy,
        player,
        ruleRegistry,
        unit: settlers,
        unitRegistry,
      } = await setUp(Settlers, false);

      // As though it hadn't founded its first city yet.
      cityRegistry.unregister(city);

      const explorer = new Unit(
        null,
        player,
        city.tile().getNeighbour('w'),
        ruleRegistry
      );

      unitRegistry.register(explorer);
      explorer.destroy(enemy);

      expect(defeatedEffect).not.called();

      settlers.destroy(enemy);

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
