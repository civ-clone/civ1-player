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
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import TurnEnd from '@civ-clone/core-player/Rules/TurnEnd';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';

export const getRules: (
  currentPlayerRegistry?: CurrentPlayerRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine
) => TurnEnd[] = (
  currentPlayerRegistry: CurrentPlayerRegistry = currentPlayerRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  engine: Engine = engineInstance
): TurnEnd[] => [
  new TurnEnd(
    new Criterion((): boolean => currentPlayerRegistry.length > 1),
    new Effect((player: Player): void => {
      const [nextPlayer] = currentPlayerRegistry.entries();

      currentPlayerRegistry.unregister(player);

      ruleRegistry.process(TurnStart, nextPlayer);
      engine.emit('player:turn-start', nextPlayer);
    })
  ),
  new TurnEnd(
    new Criterion((): boolean => currentPlayerRegistry.length <= 1),
    new Effect((player: Player): void => {
      currentPlayerRegistry.unregister(player);

      engine.emit('turn:end');
    })
  ),
  new TurnEnd(
    new Effect((player: Player): void => {
      engine.emit('player:turn-end', player);
    })
  ),
];

export default getRules;
