import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import TurnEnd from '@civ-clone/core-player/Rules/TurnEnd';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';

export const getRules: (
  ruleRegistry?: RuleRegistry,
  clientRegistry?: ClientRegistry
) => TurnStart[] = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): TurnStart[] => [
  new TurnStart(
    new Effect((player: Player): void => {
      clientRegistry
        .getByPlayer(player)
        .takeTurn()
        .then((): void => {
          ruleRegistry.process(TurnEnd, player);
        });
    })
  ),
];

export default getRules;
