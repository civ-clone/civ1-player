import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
export declare const getEvents: (
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  ruleRegistry?: RuleRegistry
) => [string, (player: Player) => void][];
export default getEvents;
