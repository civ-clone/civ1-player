import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import { startPlayerTurn } from '@civ-clone/base-player/lib/turns';

export const getEvents: (
  clientRegistry?: ClientRegistry,
  engine?: Engine,
  ruleRegistry?: RuleRegistry
) => [string, (player: Player) => void][] = (
  clientRegistry: ClientRegistry = clientRegistryInstance,
  engine: Engine = engineInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): [string, (player: Player) => void][] => [
  [
    'player:turn-start',
    (player: Player): void => {
      startPlayerTurn(player, clientRegistry, engine, ruleRegistry);
    },
  ],
];

export default getEvents;
