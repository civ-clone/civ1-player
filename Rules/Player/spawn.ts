import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
import Tile from '@civ-clone/core-world/Tile';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Spawn[] => [
  new Spawn(
    new Effect((player: Player, tile: Tile): void => {
      new Settlers(null, player, tile, ruleRegistry);
    })
  ),
];

export default getRules;
