import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Settlers from '@civ-clone/base-unit-settlers/Settlers';
import Spawn from '@civ-clone/core-player/Rules/Spawn';
import Tile from '@civ-clone/core-world/Tile';
import spawnUnits from '@civ-clone/base-player/lib/spawnUnits';

export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Spawn[] => [
  new Spawn(
    'civ1-player:player/spawn/settlers',
    // Civilization's start units: one Settlers.
    new Effect((player: Player, tile: Tile): void => {
      spawnUnits(player, tile, [Settlers], ruleRegistry);
    })
  ),
];

export default getRules;
