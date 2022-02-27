import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
export declare const getRules: (
  cityRegistry?: CityRegistry,
  engine?: Engine,
  unitRegistry?: UnitRegistry
) => Destroyed[];
export default getRules;
