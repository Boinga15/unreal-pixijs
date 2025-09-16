# The Game Class
The game class is the root of any project, acting as both the entry way to start the project as well as the first thing updated every frame.

## Important Variables
- ```gameWidth: number``` - The width of the game screen.

- ```gameHeight: number``` - The height of the game screen.

- ```level: Level | undefined``` - A reference to the current level that is loaded. This is undefined if no level is currently loaded.

- ```keys: Record<string, Boolean>``` - Which keys are currently being held. You can use something like ```game.keys["KeyA"]``` or similar for other keys to check if a key is being held.

- ```mousePos: {x: number, y: number}``` - The current position of the mounse on the game with respect to the game's bounding box in both size and locatoin.

- ```mouseDown: boolean[]``` - Which mouse buttons are currently pressed. mouseDown[0] is the left-mouse button, mouseDown[1] is for the middle-mouse button, and mouseDown[2] is the right-mouse button.

## Useful Functions
- ```addPersistantActor(actor: Actor): Actor``` - Given a new actor object, adds it to the list of persistant actors and calls that actor's onCreate function.

- ```adjustZIndexes()``` - Called naturally every time the zIndexes of the actors and widgets must be updated. Updates their zIndexes to ensure that widgets are placed above every actor.

- ```changeBackgroundColour(newColour: string)``` - Changes the base background colour of the game to the new colour.

- ```getPersistantActorOfClass(targetClass: Class of Type Actor): GivenClass | undefined``` - Given a class that is a child of the Actor class, search for and return the first instance of an actor of that class from the list of persistant actors. If no such actor exists, return undefined instead.

- ```getPersistantActorsOfClass(targetClass: Class of Type Actor): GivenClass[]``` - Given a class that is a child of the Actor class, search for and return every persistant actor currently loaded into the game which is of that class type. The return array is in the same type as the provided class.

- ```getPersistantActorsImplementingScript(targetScriptClass: Class of Type Script): Actor[]``` - Given a class that is a child of the Script class, return all persistant actors who implement this script as an array of type Actor.

- ```getPersistantWidgetsOfClass(targetWidgetType: Class of Type Widget): GivenClass[]``` - Given a class that is a child of the Widget class, search for and return every persistant widget currently loaded into the game which is othat class type. The return array is in the same type as the provided class.

- ```getPersistantWidgetOfClass(targetWidgetType: Class of Type Widget): GivenClass | undefined``` - Given a class that is a child of the Widget class, search for and return the first instance of a widget int he list of persistant widgets which is of the given class type. if no such widget exists, return undefined instead.

- ```addPersistantWidget(newWidget: Widget): Widget``` - Given an object reference to a new widget, add it to the list of persistant widgets in the game and call "onConstructor" for that widget. Also marks the new widget as persistant.

- ```removePersistantWidget(targetWidget: Widget): boolean``` - Removes the given widget object from the list of persistant widgets, also calling that widget's "deconstructWidget" function. Retruns a boolean which is true if the widget was successfully removed, or false otherwise.

- ```removeAllPersistantWidgets()``` - Remoevs all persistant widgets currently loaded into the game, calling their deconstruct functions and clearing the persistant widget list.

- ```loadLevel(level: Level): Level``` - Used when you need to load a new level, calling the original level's unload function, and calling the new level's load function. Also re-adjusts zIndexes automatically. Note that in order to create a new level, you have to pass a level object, not the class.

- ```playSound(targetSound: string, settings: {volume: number, looping: boolean} = {volume: 1.0, looping: false})``` - Plays the given targetSound, assuming said sound was loaded into the game on start-up. Best used for one-shot sounds, such as sound effects.

- ```removeAllPersistantActors()``` - Removes all persistant actors currently present within the game, calling their remove functions.

- ```removePersistantActor(actor: Actor): boolean``` - Removes an actor from the list of persistant ones, taking in the reference to an actor object. Returns a boolean which is true if the actor was successfully removed, or false otherwise. Also calls the actor's 'onRemove' function.

- ```spawnSound(targetSound: string, settings: {volume?: number, looping?: boolean, autoplay?: boolean} = {volume: 1.0, looping: false, autoplay: true})``` - Spawns a SoundObject that contains the given sound ID. This allows you to start, stop, and manipulate a sound instance life. Best used for looping sound effects, such as music.

- ```stopAllSounds()``` - Stops all sounds being played, both from "playSound" and "spawnSound".

## Mathematical Functions
The above list of functions are useful for handling the game state and gathering information. The below function are more useful when programming the functional part of actors or widgets, as well as implementing basic features such as collisions and projectiles.

- ```angleToVector(angle: number, magnitude: number = 1): {x: number, y: number}``` - Converts a given angle to a vector, returning its x and y components. Also allows you to provide a magnitude value that determines the magnitude of the final vector.

- ```getAngle(point1: {x: number, y: number}, point2: {x: number, y: number}): number``` - Gets the angle in radians between two points, with the angle originating from point1.

- ```getDistance(point1: {x: number, y: number}, point2: {x: number, y: number}): number``` - Returns the mathematical accurate distance bewteent two points in pixels.

- ```getSquaredDistance(point1: {x: number, y: number}, point2: {x: number, y: number}): number``` - Returns the square of the distance between two points in pixels. This function doesn't square root any numbers, and is thus slightly more efficient than getDistance.

- ```pointToPointCollision(point1: {x: number, y: number}, point2: {x: number, y: number}): boolean``` - Given two points, returns whether or not those two points are colliding (their points are in the same place). Returns true if they are colliding, or false otherwise.

- ```pointToRectCollision(point: {x: number, y: number}, rect: {x: number, y: number, xSize: number, ySize: number}): boolean``` - Given a point and a rectangle, returns true if the point is within the rectangle, and false otherwise. The X and Y coordinates of the rectangle is the top-left corner of the rectangle.

- ```rectToRectCollision(rect1: {x: number, y: number, xSize: number, ySize: number}, rect2: {x: number, y: number, xSize: number, ySize: number}): boolean``` - Given two rectangles, returns true if the two rectangles are intersecting, and false otherwise. The X and Y coordinates of both rectangles are their top-left corners.

## Using the Game Class
You'll mostly be using the game class in two ways - using it in other classes, and manipulating in one game start-up.

### In Other Classes
All classes have a "game" property, which is a reference to the main game. This is how you can call the game's functions in other classes, giving actors and widgets the ability to reference the game level, the game itself, and persistant actors as well as widgets.

To do this, you can usually call the game class through ```this.game```. For example, if you want to program simple projectile functionality:

```ts
this.x += this.xSpeed
this.y += this.ySpeed

// Checking if the projectile is still on-screen:
if (!this.game.pointToRectCollision({x: this.x, y: this.y}, {x: -600, y: -600, xSize: 1200, ySize: 1200})) {
    this.game.level!.removeActor(this);
    return;
}

// Collision with enemies.
const enemies = this.game.level!.getActorsOfClass(Enemy);

for (const enemy of enemies) {
    if (this.game.pointToRectCollision({x: this.x,y: this.y},{x: enemy.x, y: enemy.y, xSize: enemy.xSize, ySize: enemy.ySize})) {
        enemy.takeDamage(10);
        this.game.level!.removeActor(this);
        return;
    }
}
```

### On Game Start
The game class is loaded and launched in "main.ts":

```ts
import { Game } from "unreal-pixijs";
import { StarterLevel } from "./levels/starter_level";

// A list of sound effects and music you plan on using in the game.
const sfxAssets = {}

// The actual game object. The first two values are the pixel width and height of the viewport.
const game = new Game(1000, 1000, sfxAssets);
game.beginGame();

// The starter level. It is highly recommended that you start with a level that merely serves as a splash screen to ensure user interaction before playing any sound effects.
game.loadLevel(new StarterLevel(game));
```

The most important lines are the one defining sfxAssets, game, as well as the one using game.loadLevel.

First, when creating a new game instance, the first two values are the size of the viewport. The way the viewport size works is that it's the number of game pixels displayed, NOT the actual size of the game on the browser. Effectively, if you set the window to be 1000x1000, then there will be a thousand pixels across the game board in both directions regardless of how large the screen is. A window of 200x200, however, will still be the same size in terms of how large it would be in the browser. However in the game, the screen itself only shows 200 pixels in either direction, so it would be like you zoomed in up to five times on the game.

The second thing is the initial level loading. This loads the starter level of the game. Most commonly, this will be a splash screen that simply prompts the user to click a button to start the game, which allows for user interaction that makes playing sounds and music possible.

Speaking of which, the sfxAssets is a list of available sounds and music you can use, for example:

```ts
const sfxAssets = {
    "shoot": "sfx/shoot.wav",
    "reload": "sfx/reload.wav",
    "music_battle": "music/battle.wav"
}
```

The first string is the ID of the sound, while the second string is the path to that sound effect from public (remember, all sound effects and sprites should be placed within the "public" folder). This allows you to later call sound effects like this:

```ts
this.game.playSound("shoot", {volume: 0.2});
```

Remember that due to browser restrictions, no sound will be played until the user interacts with the webpage. This means that you should have a splash screen that prompts the user to click on a button loaded as your starting level before playing any sounds. This means any main menu music or sound effects there will be allowed to play as there was user interaction.

## Creating Child Classes of Game
There shouldn't be too much of a reason for why you would need to create a child version of the game class. All of your game's functionality should be done through level and actor classes, and anything that is to be handled globally can be done by creating a persistant actor (e.g. a "game manager") and loading it at the start of the game through the splash or menu screen.

If you do create a child class of the Game class, however (perhaps to add your own functions or to change some base functionality), you can do so easily through:

```ts
class NewGame extends Game {
    constructor(gameWidth: number, gameHeight: number, soundLibrary: Record<string, string>, settings: {borderColour: string, backgroundColour: string} = {borderColour: "#000000", backgroundColour: "#383838ff"}) {
        super(gameWidth, gameHeight, soundLibrary, settings);
    }
}
```

From here, you can add or change whatever functionality you need to.