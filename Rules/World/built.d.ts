import { AttributeRegistry } from '@civ-clone/core-civilization/AttributeRegistry';
import { CityNameRegistry } from '@civ-clone/core-civilization/CityNameRegistry';
import { CivilizationRegistry } from '@civ-clone/core-civilization/CivilizationRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { LeaderRegistry } from '@civ-clone/core-civilization/LeaderRegistry';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerWorldRegistry } from '@civ-clone/core-player-world/PlayerWorldRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TraitRegistry } from '@civ-clone/core-civilization/TraitRegistry';
import Built from '@civ-clone/core-world/Rules/Built';
export declare const getRules: (
  civilizationRegistry?: CivilizationRegistry,
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  playerRegistry?: PlayerRegistry,
  playerWorldRegistry?: PlayerWorldRegistry,
  ruleRegistry?: RuleRegistry,
  leaderRegistry?: LeaderRegistry,
  attributeRegistry?: AttributeRegistry,
  cityNameRegistry?: CityNameRegistry,
  traitRegistry?: TraitRegistry
) => Built[];
export default getRules;
