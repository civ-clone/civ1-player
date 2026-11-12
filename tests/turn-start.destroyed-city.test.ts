import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import { expect, spy, use } from 'chai';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import BuildingComplete from '@civ-clone/core-city-build/Rules/BulidingComplete';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import CityYield from '@civ-clone/core-city/Rules/Yield';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Food from '@civ-clone/base-terrain-yield-food/Food';
import Grassland from '@civ-clone/base-terrain-grassland/Grassland';
import Player from '@civ-clone/core-player/Player';
import PlayerWorld from '@civ-clone/core-player-world/PlayerWorld';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import Production from '@civ-clone/base-terrain-yield-production/Production';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Trade from '@civ-clone/base-terrain-yield-trade/Trade';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import WorkedTileRegistry from '@civ-clone/core-city/WorkedTileRegistry';
import { buildCost } from '@civ-clone/core-city-build/Rules/BuildCost';
import {
  generateGenerator,
  generateWorld,
} from '@civ-clone/core-world/tests/lib/buildWorld';
import foodExhausted from '@civ-clone/civ1-city/Rules/City/food-exhausted';
import foodStorage from '@civ-clone/civ1-city/Rules/City/food-storage';
import processYield from '@civ-clone/civ1-city/Rules/City/process-yield';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import shrink from '@civ-clone/civ1-city/Rules/City/shrink';
import turnStart from '../Rules/Player/turn-start';
import * as spies from 'chai-spies';

use(spies);

// civ-clone/web-renderer#975: a size-1 city whose food runs out this turn, with its build all but paid for, as `civ1-city`
//  plays it (its food and production `ProcessYield`s, and its shrinking a city to nothing destroys it).
describe('Player.turn-start: a city destroyed while its yields are processed', (): void => {
  class Item extends Buildable {
    public static build(): Item {
      return new Item();
    }
  }

  const setUp = async (food: number) => {
    const ruleRegistry = new RuleRegistry(),
      cityRegistry = new CityRegistry(),
      cityBuildRegistry = new CityBuildRegistry(),
      cityGrowthRegistry = new CityGrowthRegistry(),
      playerWorldRegistry = new PlayerWorldRegistry(),
      workedTileRegistry = new WorkedTileRegistry(ruleRegistry),
      availableBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
      player = new Player(ruleRegistry),
      completed = spy((cityBuild: CityBuild): City => cityBuild.city()),
      trade = spy((cityYield: Trade, city: City): City => city);

    ruleRegistry.register(
      ...turnStart(ruleRegistry, cityRegistry),
      ...foodExhausted(),
      ...foodStorage(ruleRegistry),
      ...processYield(
        cityBuildRegistry,
        cityGrowthRegistry,
        undefined,
        ruleRegistry
      ),
      ...shrink(cityGrowthRegistry, playerWorldRegistry, workedTileRegistry),
      new CityYield(
        new Effect(() => [new Food(food), new Production(2), new Trade(1)])
      ),
      new ProcessYield(
        new Criterion((cityYield) => cityYield instanceof Trade),
        new Effect(trade)
      ),
      new Build(new Effect((): IBuildCriterion => new Criterion(() => true))),
      ...buildCost(Item, 10),
      new BuildingComplete(new Effect(completed))
    );

    availableBuildItemsRegistry.register(Item);

    const world = await generateWorld(
        generateGenerator(9, 5, Grassland),
        ruleRegistry
      ),
      cities: City[] = [];

    playerWorldRegistry.register(new PlayerWorld(player, world));

    for (const x of [2, 6]) {
      const city = await setUpCity({
          ruleRegistry,
          player,
          world,
          tile: world.get(x, 2),
          playerWorldRegistry,
          cityGrowthRegistry,
          workedTileRegistry,
          tileImprovementRegistry: new TileImprovementRegistry(),
        }),
        cityBuild = new CityBuild(
          city,
          availableBuildItemsRegistry,
          ruleRegistry
        );

      cityRegistry.register(city);
      cityBuildRegistry.register(cityBuild);

      cityBuild.build(Item);
      // 2 shields short: this turn's complete it.
      cityBuild.add(new Production(8));

      cities.push(city);
    }

    return {
      cities,
      cityBuildRegistry,
      cityGrowthRegistry,
      completed,
      player,
      ruleRegistry,
      trade,
    };
  };

  it('completes the build of a size-1 city with food to spare', async (): Promise<void> => {
    const {
      cities,
      cityGrowthRegistry,
      completed,
      player,
      ruleRegistry,
      trade,
    } = await setUp(0);

    ruleRegistry.process(TurnStart, player);

    cities.forEach((city) => {
      expect(city.destroyed()).false;
      expect(cityGrowthRegistry.getByCity(city).size()).equal(1);
    });
    expect(completed).called.exactly(2);
    expect(trade).called.exactly(2);
  });

  it('completes nothing in a size-1 city that starves away, nor processes its trade', async (): Promise<void> => {
    const {
      cities: [city, other],
      cityBuildRegistry,
      cityGrowthRegistry,
      completed,
      player,
      ruleRegistry,
      trade,
    } = await setUp(-1);

    // Only the first city's food runs out: the second has its box full enough to cover the turn's shortfall.
    cityGrowthRegistry.getByCity(other).add(new Food(5));

    ruleRegistry.process(TurnStart, player);

    expect(city.destroyed()).true;
    expect(cityBuildRegistry.getByCity(city).building()?.item()).equal(Item);
    expect(cityBuildRegistry.getByCity(city).progress().value()).equal(8);

    // The other city's turn goes on as usual.
    expect(other.destroyed()).false;
    expect(completed).called.exactly(1);
    expect(completed).called.with(cityBuildRegistry.getByCity(other));
    expect(trade).called.exactly(1);
    expect(trade).called.with(other);
  });

  it('processes none of the yields left once a city is destroyed by its shields', async (): Promise<void> => {
    const {
      cities: [city, other],
      cityGrowthRegistry,
      completed,
      player,
      ruleRegistry,
      trade,
    } = await setUp(0);

    // As a size-1 city completing Settlers is.
    ruleRegistry.register(
      new BuildingComplete(
        new Criterion(
          (cityBuild: CityBuild): boolean => cityBuild.city() === city
        ),
        new Effect((cityBuild: CityBuild): void =>
          cityGrowthRegistry.getByCity(cityBuild.city()).shrink()
        )
      )
    );

    ruleRegistry.process(TurnStart, player);

    expect(city.destroyed()).true;
    expect(other.destroyed()).false;
    expect(completed).called.exactly(2);
    expect(trade).called.exactly(1);
    expect(trade).called.with(other);
  });
});
