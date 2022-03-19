import {
  PlayerRegistry,
  instance as playerRegistryInstance,
} from '@civ-clone/core-player/PlayerRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
// import Defeated from "@civ-clone/core-player/Rules/Defeated";
import Player from '@civ-clone/core-player/Player';
import {
  CurrentPlayerRegistry,
  instance as currentPlayerRegistryInstance,
} from '@civ-clone/core-player/CurrentPlayerRegistry';

export const getEvents: (
  ruleRegistry?: RuleRegistry,
  playerRegistry?: PlayerRegistry,
  currentPlayerRegistry?: CurrentPlayerRegistry
) => [string, (player: Player) => void][] = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  playerRegistry: PlayerRegistry = playerRegistryInstance,
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance
): [string, (player: Player) => void][] => [
  [
    'player:defeated',
    (player: Player): void => {
      playerRegistry.unregister(player);
      currentPlayerRegistry.unregister(player);
    },
  ],
  // [
  //   'player:defeated',
  //   (player: Player): void => ruleRegistry.process(Defeated, player),
  // ],
];

export default getEvents;
