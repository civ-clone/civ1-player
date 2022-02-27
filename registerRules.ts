import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import cityDestroyed from './Rules/City/destroyed';
import playerAdded from './Rules/Player/added';
import playerAction from './Rules/Player/action';
import turnStart from './Rules/Turn/start';
import unitCreated from './Rules/Unit/created';
import unitDestroyed from './Rules/Unit/destroyed';
import visibility from './Rules/Unit/visibility';
import visibilityChanged from './Rules/Player/visibility-changed';
import worldBuilt from './Rules/World/built';
// import turnStart from './Rules/Player/turn-start';
// import turnEnd from './Rules/Player/turn-end';

ruleRegistryInstance.register(
  ...cityDestroyed(),
  ...playerAdded(),
  ...playerAction(),
  ...unitCreated(),
  ...unitDestroyed(),
  ...turnStart(),
  ...visibility(),
  ...visibilityChanged(),
  ...worldBuilt()

  // these are problematic so we need to stick to events for now
  // ...turnEnd(),
  // ...turnStart()
);
