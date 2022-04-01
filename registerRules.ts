import cityCaptured from './Rules/City/captured';
import cityDestroyed from './Rules/City/destroyed';
import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import playerAction from './Rules/Player/action';
import playerAdded from './Rules/Player/added';
// import playerTurnEnd from './Rules/Player/turn-end';
// import playerTurnStart from './Rules/Player/turn-start';
import playerVisibilityChanged from './Rules/Player/visibility-changed';
import tileImprovementBuilt from './Rules/TileImprovement/built';
import unitCreated from './Rules/Unit/created';
import unitDestroyed from './Rules/Unit/destroyed';
import unitVisibility from './Rules/Unit/visibility';
import worldBuilt from './Rules/World/built';

ruleRegistryInstance.register(
  ...cityCaptured(),
  ...cityDestroyed(),
  ...playerAction(),
  ...playerAdded(),
  // these are problematic so we need to stick to events for now
  // ...playerTurnEnd(),
  // ...playerTurnStart()
  ...playerVisibilityChanged(),
  ...tileImprovementBuilt(),
  ...unitCreated(),
  ...unitDestroyed(),
  ...unitVisibility(),
  ...worldBuilt()
);
