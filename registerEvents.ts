import { instance as engineInstance } from '@civ-clone/core-engine/Engine';
import playerDefeated from './Events/Player/defeated';
import playerTurnEnd from './Events/Player/turn-end';
import playerTurnStart from './Events/Player/turn-start';
import turnEnd from './Events/Turn/start';

[
  ...playerDefeated(),
  ...playerTurnEnd(),
  ...playerTurnStart(),
  ...turnEnd(),
].forEach(([event, handler]) => engineInstance.on(event, handler));
