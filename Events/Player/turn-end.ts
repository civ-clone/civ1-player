import {
  CurrentPlayerRegistry,
  instance as currentPlayerRegistryInstance,
} from '@civ-clone/core-player/CurrentPlayerRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import { endPlayerTurn } from '@civ-clone/base-player/lib/turns';

export const getEvents: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => [string, (player: Player) => void][] = (
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  engine: Engine = engineInstance
): [string, (player: Player) => void][] => [
  [
    'player:turn-end',
    (player: Player): void => {
      endPlayerTurn(player, currentPlayerRegistry, ruleRegistry, engine);
    },
  ],
];

export default getEvents;
