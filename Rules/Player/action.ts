import {
  endTurnActions,
  hasNoOtherMandatoryActions,
} from '@civ-clone/base-player/lib/endTurn';
import Action from '@civ-clone/core-player/Rules/Action';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Priority from '@civ-clone/core-rule/Priority';

// Defined here so we can reference it
const endOfTurnRule: Action = new Action(
  'civ1-player:player/action/end-turn',
  // `Low` is probably enough in most cases, but just to make sure, it's over 9000
  new Priority(9001),
  // Switched off while it asks, to prevent infinite recursion; only whether there is another is asked
  //  (civ-clone/web-renderer#314).
  new Criterion((player: Player) =>
    hasNoOtherMandatoryActions(player, endOfTurnRule)
  ),
  new Effect((player: Player) => endTurnActions(player))
);

export const getRules = (): Action[] => [endOfTurnRule];

export default getRules;
