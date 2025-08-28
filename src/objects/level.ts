import { Game } from "../managers";
import { Actor } from "./actors";

// Used for getting all actors and widgets of a class.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorConstructor<T extends Actor = Actor> = new (...args: any[]) => T; 

/**
 * Represents a level in the game. A level can be thought of like a scene. Actors exist within a level, and once the level is unloaded, the actors in that level disappear as well. It is best practice to almost always use levels wherever you want to display a new screen to the user, sincei t helps contanerise actor interactions and ensure that no actors unintendly spill over into the next scene.
 * 
 * Levels are also used to store widgets that are loaded just for that level. Just like any actors loaded into ther level, these widgets are removed from the game once the level is unloaded.
 * 
 * Note that the Level class is abstract, and thus you are required to make your own Level class like so:
 * 
 * @example
 * export class FirstLevel extends Level {
 *  constructor(game: Game) {
 *   super(game);
 *  }
 * 
 *  update(deltaTime: number) {
 *   ...
 *  }
 * }
 */
export abstract class Level {
    /**
     * Reference to the main game object.
    */
    game: Game

    /**
     * A list of currently managed actors in the level. To add to this list, use the function "addActor(...)", and use the function "removeActor(...)" to remove from this list.
     */
    actors: Actor[] = []

    constructor(game: Game) {
        this.game = game;
    }

    /**
     * Called every game tick, handles overall updates in the level. Note that super.update(deltaTime) should be called at the start of this function, else any actors or widgets within the level will not automatically update.
     * @param deltaTime The time between this frame and the previous one, calculated in seconds.
     */
    update(deltaTime: number) {
        for (const actor of this.actors) {
            actor.update(deltaTime);
        }
    }

    /**
     * Called when the game loads this level. Should be used to load initial actors and widgets into the level.
     */
    onLoad() {}
    
    /**
     * Called when the game unloads this level. You should call "super.onUnload();" at the start of this function, else actors and widgets within the level may not properly unload.
     */
    onUnload() {
        for (const actor of this.actors) {
            actor.remove()
        }
    }

    /**
     * Adds an actor to the level.
     * @param actor An actor object, which is a reference to the actor you wish to add to the level.
     * @returns A reference to that actor object.
     * 
     * @example
     * this.playerReference = this.level.addActor(new Player());
     */
    addActor(actor: Actor): Actor {
        this.actors.push(actor);
        actor.onCreate(false, this);
        return actor;
    }

    /**
     * Removes an actor from the level assuming that actor exists within the level's actor list.
     * @param actor The actor you wish to remove by reference.
     * @returns Whether or not the actor was successfully removed (true if so, false otherwise).
     * 
     * @example
     * for (const actor of this.level.actors) {
     *   if (actor.x <= -200) {
     *     this.level.removeActor(actor);
     *   }
     * }
     */
    removeActor(actor: Actor): boolean {
        if(!this.actors.includes(actor)) {
            return false;
        }

        actor.onRemove();
        this.actors = this.actors.filter((cActor) => cActor !== actor);
        return true;
    }

    /**
     * Obtains all actors in the level of a given class, including actors who's class is a child of the given class.
     * @param targetClass The class to search for.
     * @returns A list of object references for every actor in the level who has the given class.
     * 
     * @example
     * const enemies = this.level.getActorsOfClass(Enemy);
     */
    getActorsOfClass<T extends Actor>(targetClass: ActorConstructor<T>): T[] {
        return this.actors.filter((actor): actor is T => (actor instanceof targetClass));
    }

    /**
     * Obtains the first instace of an actor in the level who is an object of the given class, or is an object of a child of the given class.
     * @param targetClass The class to search for.
     * @returns A reference of the first actor's object who matches the given class. If no such actor exists within the level, this function returns "undefined" instead.
     * 
     * @example
     * this.areaManager = getActorOfClass(AreaManager);
     * this.areaManager?.updateArea();
     */
    getActorOfClass<T extends Actor>(targetClass: ActorConstructor<T>): T | undefined {
        for (const actor of this.actors) {
            if (actor instanceof targetClass) {
                return actor;
            }
        }

        return undefined;
    }
}