import Action from '@civ-clone/core-player/Rules/Action';
import Effect from '@civ-clone/core-rule/Effect';
import { EndTurn } from '../PlayerActions';
import MandatoryPlayerAction from '@civ-clone/core-player/MandatoryPlayerAction';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import action from '../Rules/Player/action';
import { expect } from 'chai';

describe('Player.action', () => {
  it('should provide an `EndOfTurn` action if there are no other `MandatoryPlayerAction`s to process', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry();

    ruleRegistry.register(...action());

    const player = new Player(ruleRegistry),
      actions = player.actions();

    expect(actions).length(1);
    expect(actions[0]).instanceof(EndTurn);

    const anotherAction = new Action(
      new Effect((player: Player) => [new MandatoryPlayerAction(player, null)])
    );

    ruleRegistry.register(anotherAction);

    const actionsIncludingAnother = player.actions();

    expect(actionsIncludingAnother).length(1);
    expect(actionsIncludingAnother[0]).not.instanceof(EndTurn);

    ruleRegistry.unregister(anotherAction);

    const updatedActions = player.actions();

    expect(updatedActions).length(1);
    expect(updatedActions[0]).instanceof(EndTurn);

    ruleRegistry.register(
      new Action(
        new Effect((player: Player) => [new PlayerAction(player, null)])
      )
    );

    const actionsIncludingOptionalAction = player.actions(),
      mandatoryActions = player.mandatoryActions();

    expect(actionsIncludingOptionalAction).length(2);
    expect(mandatoryActions).length(1);
    expect(mandatoryActions[0]).instanceof(EndTurn);
  });
});
