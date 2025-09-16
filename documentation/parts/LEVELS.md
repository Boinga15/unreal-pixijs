# Level Classes
A level is a scene which holds actors and widgets and effectively lets programmers create an environment which can be easily loaded in and out of the game whenever needed.

## Important Variables
- ```game: Game``` - A reference to the root game class.

- ```actors: Actor[]``` - The list of actors that are currently loaded into the level.

- ```widgets: Widget[]``` - The list of widgets that are currently loaded into the level.

- ```cameraX: number``` - The X location of the game camera. Changing this lets you effectively scroll the game left and right.

- ```cameraY: number``` - The Y location of the game camera. Changing this lets you effectively scroll the game up and down.

## Useful Functions
- ```update(deltaTime: number)``` - A very important function that nearly every child class of Level should override. This function is called every frame and acts as a way to update the level state every frame. Ensure you call ```super.update(deltaTime)``` at the top of the overriden function, else actors and widgets in the level won't automatically update as well.

- ```onLoad()``` - Called automatically when the level loads for the first time. The normal function is empty, so you can override this function without calling the super function if you want the level to do something when it loads (usually to load actors and widgets).

- ```onUnload()``` - Called automatically when a new level is loaded into the game and this level must be unloaded. The function normally removes all actors and widgets in the level, so the super function (```super.onUnload()```) should be called at the top of this function if this function is overriden.

- ```addActor(actor: Actor): Actor``` - Adds a given actor object to the level's actor list, also calling that actor's "onCreate" function. The return value is the actor that was just added, allowing you to call things like ```const player = this.addActor(new Player(this.game));```.

- ```removeActor(actor: Actor): boolean``` - Removes a given actor object from the level's actor list, also calling that actor's onRemove function. Returns a boolean which is true if the actor was successfully removed, or false otherwise.

- ```removeAllActors()``` - Removes all actors from the level, calling their onRemove functions and clearing them from the level.

- ```getActorsOfClass(targetClass: Class of Type Actor): GivenClass[]``` - Given a class which is a child of Actor, return an array of actors which contains every actor in the level who is an object of the given class or a child of the given class.

- ```getActorOfClass(targetClass: Class of Type Actor): Given Class | undefined``` - Given a class which is a child of Actor, return the first actor in the level who is of that class type. If no such actor exists, return undefined instead.

- ```getActorsImplementingScript(targetScriptClass: Class of Type Script): Actor[]``` - Given a class which is a child of Script, return an array of actors which contains every actor in the level implementing a script of that class.

- ```addWidget(newWidget: Widget): Widget``` - Given a new widget object, add a widget to the level and call its onConstruct function. This function returns the widget object that was just added in the case that you wish to store the newly added widget in a variable.

- ```removeWidget(targetWidget: Widget): boolean``` - Given a widget object, remove it from the list of widgets in the level, calling its deconstruct function as well. Returns a boolean which is true if the widget was successfully removed, and false otherwise.

- ```removeAllWidgets()``` - Removes all widgets in the level, calling their deconstruct functions.

- ```getWidgetsOfClass(targetWidgetType: Class of Type Widget): GivenClass[]``` - Given a class that is a child of Widget, get all widgets in the level that are of this class type, returning them as an array of the class type.

- ```getWidgetOfClass(targetWidgetType: Class of Type Widget): Given Class | undefined``` - Given a class that is a child of Widget, get the first widget in the level that is of this class type. If no such widget exists, return undefined instead.

## The Purpose of Levels
Levels are useful when you want to create a scene or scenario that you'll be loading multiple times over, and don't want to worry about having to make sure everything is set up properly when you load a new level. This is because once a level is loaded, everything should automatically load for you, and when the level is no longer needed, you can make it easily clean up any actors or widgets that have been left over. Levels are also responsible for controlling the viewport camera.

### Viewport Camera
The viewport camera is effectively the X and Y coordinates of the location the player can see, with the centre of the screen being aligned with the viewport camera. The camera starts at X = 0 and Y = 0, and can be moved by simply setting their values.

```ts
this.cameraX = 200;
this.cameraY = 300;
```

Actors are drawn relative to the camera. If an actor is at X = 500, and the camera is at X = 500 as well, then the actor will appear in the centre of the screen. On the other hand is the actor is at X = 300, but the camera is at X = 500, then the actor will appaer 200 units to the left of the camera. Widgets are not affected by the camera location and are instead attached to the viewport screen itself, moving with the camera.

## Creating Levels
Creating a level can be done by creating a child class of the main Level class:

```ts
class NewLevel extends Level {
    constructor(game: Game) {
        super(game);
    }
}
```

The main function you want to override is the ```update``` function, which runs every frame. Remember to call the super function in the overriden function, else actors and widgets may not properly update:

```ts
class NewLevel extends Level {
    constructor(game: Game) {
        super(game);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        // Leave the rest of your code here.
    }
}
```

The other two functions you can override are ```onLoad``` for when the level is loaded into the game, and ```onUnload``` when a new level is loaded and this level needs to be unloaded. You don't have to call the super function for onLoad, but you do for onUnload:

```ts
class NewLevel extends Level {
    constructor(game: Game) {
        super(game);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        // Leave the rest of your code here.
    }

    onLoad() {
        // Put the code that should run when the function loads.
    }

    onUnload() {
        // Code here is run before actors and widgets unload.
        super.onUnload();
        // Put extra code here for code that runs after all of the actors and widgets unload.
    }
}
```

When creating new actors or widgets that reference the level, it is very important that you add those actors in onLoad and NOT in the constructor. This is because if an actor loads in the constructor and does something with the level in ITS constructor, then there's a chance that the level won't be loaded and it will cause an error.

Once your level is ready, you can load it into the game like so:

```ts
this.game.loadLevel(new Newlevel(this.game));
```
