import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import { CurrentPlayerRegistry } from '@civ-clone/core-player/CurrentPlayerRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
export declare const getEvents: (
  clientRegistry?: ClientRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry,
  engine?: Engine,
  ruleRegistry?: RuleRegistry
) => [string, (player: Player) => void][];
export default getEvents;
