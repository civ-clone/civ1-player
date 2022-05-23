import Action from '@civ-clone/core-player/Rules/Action';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import EndTurn from '@civ-clone/base-player-action-end-turn/EndTurn';
import Player from '@civ-clone/core-player/Player';
import Priority from '@civ-clone/core-rule/Priority';

// Defined here so we can reference it
const endOfTurnRule = new Action(
  new Criterion((player: Player) => {
    // Prevent infinite recursion...
    endOfTurnRule.disable();

    const otherActions = player.mandatoryActions();

    endOfTurnRule.enable();

    return otherActions.length === 0;
  }),
  new Effect((player: Player) => [new EndTurn(player, null)]),
  new Priority(9001) // `Low` is probably enough in most cases, but just to make sure, it's over 9000
);

export const getRules: () => Action[] = (): Action[] => [endOfTurnRule];

export default getRules;
