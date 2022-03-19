import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import Captured from '@civ-clone/core-city/Rules/Captured';
export declare const getRules: (
  cityRegistry?: CityRegistry,
  engine?: Engine
) => Captured[];
export default getRules;
