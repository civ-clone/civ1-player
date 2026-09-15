import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TerrainRegistry } from '@civ-clone/core-terrain/TerrainRegistry';
import BaseGenerator, {
  IOptions,
} from '@civ-clone/simple-world-generator/BaseGenerator';
import Terrain from '@civ-clone/core-terrain/Terrain';
type GeneratorFunction = (i: number) => Terrain;
export declare class Generator extends BaseGenerator {
  #private;
  constructor(
    height: number,
    width: number,
    generator: GeneratorFunction,
    options?: IOptions,
    ruleRegistry?: RuleRegistry,
    terrainRegistry?: TerrainRegistry
  );
  generate(): Promise<Terrain[]>;
}
export default Generator;
