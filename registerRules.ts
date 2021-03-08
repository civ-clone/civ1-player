import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import playerAdded from './Rules/Player/added';
import turnStart from './Rules/Turn/start';
import unitCreated from './Rules/Unit/created';
import worldBuilt from './Rules/World/built';
// import turnStart from './Rules/Player/turn-start';
// import turnEnd from './Rules/Player/turn-end';
import visibility from './Rules/Unit/visibility';
import visibilityChanged from './Rules/Player/visibility-changed';

ruleRegistryInstance.register(
  ...playerAdded(),
  ...unitCreated(),
  ...turnStart(),
  ...worldBuilt(),

  // these are problematic so we need to stick to events for now
  // ...turnEnd(),
  // ...turnStart()

  ...visibility(),
  ...visibilityChanged()
);
