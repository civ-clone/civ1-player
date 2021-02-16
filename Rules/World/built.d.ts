import { CivilizationRegistry } from '@civ-clone/core-civilization/CivilizationRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
import YieldRegistry from '@civ-clone/core-yield/YieldRegistry';
export declare const getRules: (
  civilizationRegistry?: CivilizationRegistry,
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  yieldRegistry?: YieldRegistry,
  randomNumberGenerator?: () => number
) => Built[];
export default getRules;
