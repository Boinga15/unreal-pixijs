
The purpose of this file is to help you figure out what you have available to you, as well as help you understand the overall structure of Unreal PixiJS. It also serves as a nice self-toured guide that can help you make your first game by taking you through the things you need to know the most.

This file is split into sections, with each section talking about a specific part of Unreal PixiJS. Each section not only contains a detailed explanation of how to both use the part as well as how to derive off of it, but also a full function list so that you know what each class can and can't do.

## The Game
In-depth + Technical detail can be found [here](parts/GAME.md).

The game class is the root of any project. Every frame starts here, and through the game class, updates reciprocate down to the actors, widgets, scripts, and so on. The game class is responsible for drawing the viewport of the game, doing general calculations, keeping track of persistant actors and widgets, and pre-loading SFX.

The main place you'll see the game class is in the "main.ts" file:

```ts
import { Game } from "unreal-pixijs";
import { StarterLevel } from "./levels/starter_level";

const sfxAssets = {}

const game = new Game(1000, 1000, sfxAssets);
game.beginGame();

game.loadLevel(new StarterLevel(game));
```

You shouldn't need to create a new game class, since functionality can be easily handled by creating levels or actors.

## Levels
In-depth + Technical detail can be found [here](parts/LEVELS.md).

After the game, levels are the most important part. A level is like a scene that plays out until it is time to load a new level. Think of a level as a set where you can place actors and widgets where they need. It's almost always best to place actors and widgets inside of a level rather than in the game, making them persistant. Levels can be used to "contanerise" parts of your game, making it much easier to manage. The level is also responsible for managing the camera.

As an example, you can have three levels in your game. One for the Main Menu, one for the Gameplay, and one last level for the Game Over screen. All three of these levels are distinct from each other, and when it's time to swap levels, the original level is removed from play and everything about it is cleaned up, ensuring no actors or widgets bleed over between levels.

Levels are extremely important, so when structuring your game, it's often best if you try to split your game into multiple levles. Understanding how levels work as a step after understanding how the game class works is also highly recommended.

## Actors
In-depth + Technical detail can be found [here](parts/ACTORS.md).

Actors are the main thing you'll be using the most to program your game. An actor is an object in a game. Enemies, player, walls, platforms, and so on so forth are all actors.

The reason you'd create an actor is because you can re-use actors with ease. Considering these are the most important part of programming games, it's best that after you understand levels, you understand how to use actors next.

## Scripts
In-depth + Technical detail can be found [here](parts/SCRIPTS.md).

Scripts are a unique addition to actors that make it easier to share functionality between unrelated actors without having to give them a mutual parent that isn't the ```Actor``` class.

A script is a self-contained piece of code with its own variables and functions which has the purpose of doing something for an actor. This "something" can then be implemented on other actors as well. Examples of places scripts can be used include health scripts, movement scripts, attack scripts, and so on.

Inheritence, interfaces, and scripts can all be used in tandem to write clean and easily-expandable code. When you get comfortable with using actors, I recommend learning how to use scripts as well.

## Widgets
In-depth + Technical detail can be found [here](parts/WIDGETS.md).

Widgets are used for HUDs and menus. The main difference between an actor and a HUD is that while actors have an absolute space in the world, HUDs are fixed to the camera. This means no matter how much you move the camera, the HUD will stay in-place.

Using widgets is an easy way to convey information to the player. They are usually loaded into the level itself, meaning once the level is unloaded, the widgets unload as well. Once you have your main game loop setup with actors and levels, you should look into implementing widgets as well.

## Sounds
In-depth + Technical detail can be found [here](parts/SOUNDS.md).

A sound system is pre-implemented into Unreal PixiJS, making it easy to load and use sound effects. While this is arguably the most simple part of Unreal PixiJS, it still deserves its own section thanks to sound objects, which let you manipulate sounds after playing them.

Once you've finished your game and wish to add some polish and punch through SFX, learn how to use the sound system and add that impact into your game.