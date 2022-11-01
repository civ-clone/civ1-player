import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TerrainRegistry,
  instance as terrainRegistryInstance,
} from '@civ-clone/core-terrain/TerrainRegistry';
import BaseGenerator, {
  IOptions,
} from '@civ-clone/simple-world-generator/BaseGenerator';
import Terrain from '@civ-clone/core-terrain/Terrain';

type GeneratorFunction = (i: number) => Terrain;

export class Generator extends BaseGenerator {
  #generator: GeneratorFunction;

  constructor(
    height: number,
    width: number,
    generator: GeneratorFunction,
    options: IOptions = {},
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    terrainRegistry: TerrainRegistry = terrainRegistryInstance
  ) {
    super(height, width, options, ruleRegistry, terrainRegistry);

    this.#generator = generator;
  }

  async generate(): Promise<Terrain[]> {
    return new Array(this.height() * this.width())
      .fill(0)
      .map((_, i) => this.#generator(i));
  }
}

export default Generator;
