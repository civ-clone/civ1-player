import { CivilizationRegistry } from '@civ-clone/core-civilization/CivilizationRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
export declare const getRules: (
  civilizationRegistry?: CivilizationRegistry,
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  ruleRegistry?: RuleRegistry,
  randomNumberGenerator?: () => number
) => Built[];
export default getRules;
