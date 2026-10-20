# civ1-player

A repository for the `Rule`s associated with `Player` functions

This defines the core `Player`-related elements of the gameplay (including triggering `Player.takeTurn`!), with `Rule`s
that aim to recreate a close approximation of the original Civilization gameplay rules.

## Adding a player mid-game

`lib/addPlayer(game, world, { civilization, leader })` brings a new player into a running game: its `Added` rules run,
it claims a civilization and leader (drawn from those left when not given), gets a `PlayerWorld` and joins
`game.players`, so it moves from the next turn. It has no units until a `Spawn` rule gives it some. It emits
`player:spawned` for the host to give the player a client.
