# Actor Class
An actor class is an entity in the game or level that acts independently and runs its own code. The main reason using actors makes programming easier is because you can re-use actors and copy-paste them across your level, as well as use them in various levels for added efficiency and code cleanliness.

## Important Variables
- ```game: Game``` - A reference to the root game class.

- ```level: Level | undefined``` - A reference to the level this actor is a part of. If this is undefined, then the actor is a persistant actor and is therefore not part of the level. If you wish to reference the level and not risk this being undefined, use ```game.level``` instead.

- ```persistantActor: boolean``` - If this actor is a persistant actor or not. Changing this variable does not change if this actor is a persistant actor or not, and should therefore only be read.

- ```scripts: Script[]``` - A reference to all of the scripts that exist within teh actor.

- ```zOrder: number``` - The zOrder of this actor relative to the other actors and widgets. Note that if a widget has a lower zOrder than an actor, the actor will still be placed below the widgets.

- ```x``` - The X location of the actor in world space.

- ```y``` - The Y location of the actor in world space.

## Useful Functions
- ```getScript(targetScript: Class of Type Script, ignoreDisabled: boolean = false): GivenClass | undefined``` - Returns the first script in the actor which has the given class type, returning undefined if no such script exists. If ignoreDisabled is set to true, then scripts which are disabled are not counted in this search.

- ```setZOrder(newZOrder: number)``` - A helper function that both sets the actor's zOrder and also adjusts Z indexes by calling ```this.game.adjustZIndexes()```.

- ```getScreenLocation()``` - Gets the location of the actor relative to the actual viewport, rather than in absolute world space.

- ```remove()``` - Removes the actor from teh game, calling the game's ```removePersistantActor``` or the level's ```removeActor``` function depending on if this actor is persistant or not.

## Making an Actor
To make a new actor, you can inherit from the Actor class and create a child class of it like so:

```ts
class NewActor extends Actor {
    constructor(game: Game) {
        super(game);
    }
}
```

The main function you'll want to override is the update function, which is called every frame.

```ts
class NewActor extends Actor {
    constructor(game: Game) {
        super(game);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        // Your code should go here.
    }
}
```

As for actor creation and deletion, the functions you want to override for those are ```onCreate``` and ```onRemove```:

```ts
class NewActor extends Actor {
    constructor(game: Game) {
        super(game);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        // Your code should go here.
    }

    onCreate(isPersistant: boolean, levelReference: Level | undefined = undefined) {
        super.onCreate(isPersistant, levelReference);
        // Your code should go here.
    }

    onRemove() {
        // Your code should go here.
        super.onRemove();
    }
}
```

Note that you can put creation code in the constructor. However, doing this risks errors if you attempt to do things like add scripts to actors in the constructor (for more information on how to do this, check the file about Scripts).

## Persistant Actors
Persistant actors are exactly like actors, with the difference that they aren't unloaded when a new level is loaded. This means the actor persists between levels, which is useful if you want to do a level transition but keep things like an enemy or player actor loaded.

Creating a persistant actor is done simply by adding an actor to the game's persistant actor list rather than the level's actor list:

```ts
this.game.addPersistantActor(new Player(this.game));
```

Persistant actors still have the X and Y coordinates in terms of world coordinates rather than relative to the screen. A persistant actor at X = 500 and Y = 500, and an actor at X = 500 and Y = 500 are both in the same place relative to the camera as well as in the world.

## Example Actor - Player
Below is an example actor of a Player, with movement functionality and a simple health variable.

```ts
export class Player extends Actor {
    health: number = 100;

    constructor(game: Game) {
        super(game);
    }

    update(deltaTime: number) {
        super.update(deltaTime);

        if (this.game.keys["KeyW"]) {
            this.y -= 3 * deltaTime;
        } else if (this.game.keys["KeyS"]) {
            this.y += 3 * deltaTime;
        }

        if (this.game.keys["KeyA"]) {
            this.x -= 3 * deltaTime;
        } else if (this.game.keys["KeyD"]) {
            this.x += 3 * deltaTime;
        }

        if (this.health <= 0) {
            this.game.loadLevel(new GameOver(this.game));
        }
    }
}
```