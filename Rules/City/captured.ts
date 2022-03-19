import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Captured from '@civ-clone/core-city/Rules/Captured';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';

export const getRules: (
  cityRegistry?: CityRegistry,
  engine?: Engine
) => Captured[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  engine: Engine = engineInstance
): Captured[] => [
  new Captured(
    // TODO: have some `Rule`s that just call `Player#defeated` or something?
    new Criterion(
      (
        capturedCity: City,
        capturingPlayer: Player,
        originalPlayer: Player
      ): boolean =>
        cityRegistry
          .getByPlayer(originalPlayer)
          .filter((city: City) => city !== capturedCity).length === 0
    ),
    new Effect(
      (capturedCity: City, capturingPlayer: Player, player: Player): void => {
        engine.emit('player:defeated', player, capturingPlayer);
      }
    )
  ),
];

export default getRules;
