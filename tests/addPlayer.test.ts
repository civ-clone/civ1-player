import { describe, it } from 'mocha';
import Added from '@civ-clone/core-player/Rules/Added';
import Babylonian from '@civ-clone/base-civilization-babylonian/Babylonian';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import Generator from './lib/Generator';
import Hammurabi from '@civ-clone/base-civilization-babylonian/Leaders/Hammurabi';
import Player from '@civ-clone/core-player/Player';
import River from '@civ-clone/base-terrain-river/River';
import World from '@civ-clone/core-world/World';
import addPlayer from '../lib/addPlayer';
import { expect } from 'chai';

// A game of its own, with Babylon and Hammurabi still to claim and a small world.
const setUp = () => {
  const game = new Game(),
    world = new World(
      new Generator(4, 4, () => new River(game.rules)),
      game.rules
    ),
    added: Player[] = [],
    spawned: Player[] = [];

  game.civilizations.register(Babylonian);
  game.leaders.register(Hammurabi);
  game.rules.register(
    new Added(new Effect((player: Player) => added.push(player)))
  );
  game.engine.on('player:spawned', (player: Player) => spawned.push(player));

  return { added, game, spawned, world };
};

describe('addPlayer', (): void => {
  it('brings a player into the game, with a civilization, a leader and a view of the world', (): void => {
    const { added, game, spawned, world } = setUp(),
      player = addPlayer(game, world);

    expect(player.civilization()).to.be.instanceOf(Babylonian);
    expect(player.civilization().leader()).to.be.instanceOf(Hammurabi);
    expect(game.players.entries()).to.deep.equal([player]);
    expect(game.playerWorlds.getByPlayer(player)).to.not.equal(undefined);
    expect(added).to.deep.equal([player]);
    expect(spawned).to.deep.equal([player]);
  });

  it('claims the civilization and leader, so nobody else can play them', (): void => {
    const { game, world } = setUp();

    addPlayer(game, world, { civilization: Babylonian, leader: Hammurabi });

    expect(game.civilizations.entries()).to.deep.equal([]);
    expect(game.leaders.entries()).to.deep.equal([]);
    expect(() => addPlayer(game, world)).to.throw(TypeError);
    expect(() => addPlayer(game, world, { civilization: Babylonian })).to.throw(
      TypeError
    );
  });
});
