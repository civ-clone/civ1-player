import { instance as engineInstance } from '@civ-clone/core-engine/Engine';
import playerTurnEnd from './Events/Player/turn-end';
import playerTurnStart from './Events/Player/turn-start';
import turnEnd from './Events/Turn/start';

[...playerTurnEnd(), ...playerTurnStart(), ...turnEnd()].forEach(
  ([event, handler]) => engineInstance.on(event, handler)
);
