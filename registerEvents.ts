import defeated from './Events/Player/defeated';
import { instance as engineInstance } from '@civ-clone/core-engine/Engine';
import start from './Events/Turn/start';
import turnEnd from './Events/Player/turn-end';
import turnStart from './Events/Player/turn-start';

[...defeated(), ...start(), ...turnEnd(), ...turnStart()].forEach(
  ([event, handler]) => engineInstance.on(event, handler)
);
