# Scripts Class
A script is a special bit of code that can be attached to any actor class in order to give it some form of behaviour. Scripts are useful when you want multiple actors to share the same piece of functionality with some deviation, but you don't want to make them all the child of the same class.

## Important Variables
- ```game: Game``` - A reference to the root game class.

- ```owningActor: Actor``` - A reference to the actor that owns this script.

- ```isEnabled: boolean``` - Whether or not this script should run its update function every frame. If set to false, this script becomes disabled and no longe runs its update function.

## Making a Script
The easiest way to make a script is to simply create a child class of the existing Script class:

```ts
class NewScript extends Script {
    constructor(game: Game, owningActor: Actor) {
        this.game = game;
        this.owningActor = owningActor;
    }

    update(deltaTime: number) {
        // Your code goes here.
    }
}
```

Note that the update function in the base Script class is an abstract function. Therefore, all scripts must override the update function.

Once your script is ready, you can add it into any actor by simply pushing it into the actor's scripts array.

```ts
class NewActor extends Actor {
    constructor(game: Game) {
        super(game);
    }

    onCreate() {
        this.scripts.push(new NewScript(this.game, this));
    }
}
```

Once this is done, the script will automatically run every frame for that actor assuming the actor's parent super function is called per frame (done through ```super.update(deltaTime)``` in the actor's update function).

## Pre-Implemented Script - Health Script
A script that exists and is ready for use is a simplistic health script. It both keeps track of health and max health, and also allows for "rolling health", where after taking damage, the actor's health is rapidly reduced to the new target value rather than instantly snapping to the new value.

### Important Variables
- ```maxHealth: number``` - The maximum health of the actor.

- ```health: number``` - The current health of the actor.

- ```rollingHealthSpeed: number``` - The amount of damage applied to the actor per frame. Normally set to 1, which means instant snapping. 0 means health never changes. The lower this value, the slower health changes to match what it should be.

- ```heldDamage: number``` - The amount of damage this actor has left to process through rolling health.

- ```onDeath: (deltaTime: number, scriptReference: HealthScript) => void``` - The function that should be run when the actor's health hits zero. Normally, this functoin simply calls the actor's remove function.

### Useful Functions
- ```takeDamage(amount: number)``` - Deals damage to the actor.

## Parent Classes vs Interfaces vs Scripts
With scripts, there is now a third way to transfer and share properties between different classes. Knowing when to use scripts and when to use something else will help greatly with your programming.

Class inheritence is best when you want a group of actors to share almost identical functionality with small changes to their base code, or changes that act more like additions to their base code. A group of enemies, for example, should all be grouped under the same parent class. Having a parent class also allows you to only check for that class when running functions like "getActorsOfClass", since it both returns actors of that class type as well as actors of class types that are children of the class.

Interfaces can be used to define functions and variables for classes that they then implement. This allows you to share function definitions or variables between classes, thus letting you ensure that some classes have a specific function. For example, if you want some of your actors to have the ability to go invisible when the player picks up a power-up, then youc an make an interface which adds a "goInvisible()" function definition. Any actor then implementing this interface will have this function.

Scripts are an extension of interfaces in a way. They don't let the actor define the functions themself, but instead provide extra functionality just for that actor. This allows you to implement the script in a variety of actors, sharing the same functionality across many actors that may not even be related. For example, if you're making a platformer, all enemies and the player should have gravity. But instead of making a parent class with gravity, you can make a script that implements gravity for them. That way if you want an enemy in the future that doesn't have gravity, you can simply disable that script in that enemy, and leave every other enemy untouched.