import Created from '@civ-clone/core-unit/Rules/Created';
import Effect from '@civ-clone/core-rule/Effect';
import Unit from '@civ-clone/core-unit/Unit';

export const getRules: () => Created[] = (): Created[] => [
  new Created(new Effect((unit: Unit): void => unit.applyVisibility())),
];

export default getRules;
