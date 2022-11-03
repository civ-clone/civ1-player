import { describe, it } from 'mocha';
import { expect, spy } from 'chai';
import Busy from '@civ-clone/core-unit/Rules/Busy';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import FillGenerator from '@civ-clone/simple-world-generator/tests/lib/FillGenerator';
import Food from '@civ-clone/base-terrain-yield-food/Food';
import Player from '@civ-clone/core-player/Player';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Trade from '@civ-clone/base-terrain-yield-trade/Trade';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import Unit from '@civ-clone/core-unit/Unit';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import World from '@civ-clone/core-world/World';
import Yield from '@civ-clone/core-yield/Yield';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import turnStart from '../Rules/Player/turn-start';
import { unitYield } from '@civ-clone/core-unit/Rules/Yield';

describe('Player.turn-start', () => {
  it('should trigger `ProcessYield`s on `TurnStart`', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      cityRegistry = new CityRegistry(),
      city = await setUpCity({
        ruleRegistry,
      }),
      processedYields: Yield[] = [],
      processYieldSpy = spy((combinedYield: Yield) => {
        processedYields.push(combinedYield);
      });

    ruleRegistry.register(
      ...turnStart(ruleRegistry, cityRegistry),
      new CityYield(
        new Effect(() => [
          new Food(2),
          new Production(3),
          new Trade(1),
          new Food(3),
          new Production(1),
          new Trade(3),
          new Food(1),
          new Production(2),
          new Trade(2),
        ])
      ),
      new ProcessYield(new Effect(processYieldSpy))
    );

    cityRegistry.register(city);

    expect(city.yields()).length(9);

    ruleRegistry.process(TurnStart, city.player());

    expect(processedYields[0]).instanceof(Food);
    expect(processedYields[0].value()).equal(6);
    expect(processedYields[1]).instanceof(Production);
    expect(processedYields[1].value()).equal(6);
    expect(processedYields[2]).instanceof(Trade);
    expect(processedYields[2].value()).equal(6);
    expect(processYieldSpy).been.called.exactly(3);
  });

  it('should trigger checks and completion of `Unit`s that are `Busy`', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      unitRegistry = new UnitRegistry(),
      world = await new World(new FillGenerator(1, 1), ruleRegistry).build(),
      unit = new Unit(null, new Player(), world.get(0, 0), ruleRegistry);

    ruleRegistry.register(
      ...turnStart(ruleRegistry, undefined, unitRegistry),
      ...unitYield(Unit)
    );

    unitRegistry.register(unit);

    unit.setActive(false);
    unit.setWaiting(true);
    unit.moves().set(0);

    expect(unit.moves().value()).equal(0);
    expect(unit.active()).false;
    expect(unit.waiting()).true;

    ruleRegistry.process(TurnStart, unit.player());

    expect(unit.moves().value()).equal(1);
    expect(unit.active()).true;
    expect(unit.waiting()).false;

    let check = false;

    unit.setBusy(
      new Busy(
        new Criterion(() => check),
        new Effect(() => {
          unit.setActive();
          unit.moves().set(unit.movement());
          unit.setWaiting(false);
        })
      )
    );

    expect(unit.busy()?.validate()).false;

    unit.setActive(false);
    ruleRegistry.process(TurnStart, unit.player());

    expect(unit.active()).false;

    check = true;

    ruleRegistry.process(TurnStart, unit.player());

    expect(unit.active()).true;
    expect(unit.moves().value()).equal(unit.movement().value());
    expect(unit.waiting()).false;
  });
});
