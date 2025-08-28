import { Container } from "pixi.js";
import { Game } from "../managers";
import { Level } from "./level";


/**
 * An object that represents an entity within the game or level. An actor is an extension of a normal container with a dedicated update function, as well as functions that fire when this actor is added and removed.
 * 
 * @example
 * export class Player extends Actor {
 *  constructor(game: Game) {
 *   super(game);
 *  }
 * 
 *  update(deltaTime: number) {
 *   ...
 *  }
 * }
 */
export abstract class Actor extends Container {
    /**
     * A reference to the game instance.
    */
    game: Game

    /**
     * A reference to the level this actor is currently a part of. If this actor is a part of game.presistantActors, then this will be undefined.
     */
    level: Level | undefined

    /**
     * Whether or not this actor is considered a "persistant actor". Persistant actors are usually stored within "game.persistantActors", and are not automatically cleared when the level changes.
    */
    persistantActor: boolean = true
    
    constructor(game: Game) {
        super();
        this.game = game;
    }

    /**
     * The update function called every frame.
     * @param deltaTime The time in seconds between this frame and the previous frame.
     */
    abstract update(deltaTime: number): void

    /**
     * Called when the actor is first created, whether it is persistant or not.
     * @param isPersistant Whether or not this actor is a persistant actor or not (persistance means it remains in-play even after a new level is loaded, therefore meaning it is not bound to a level).
     * @param levelReference A reference to the level this actor is being added to. Should only be left undefined for persistant actors.
     */
    onCreate(isPersistant: boolean, levelReference: Level | undefined = undefined) {
        this.game.app.stage.addChild(this);

        if (!isPersistant) {
            this.level = levelReference
        }

        this.persistantActor = isPersistant
    }

    /**
     * Called when this actor is removed, whether that be because the level it was in was unloaded, or because the function "removeActor" was called.
     */
    onRemove() {
        this.game.app.stage.removeChild(this);
    }

    /**
     * Removes the actor from the current level or persistant list of actors. Also calls "onRemove()" once done.
     * 
     * @example
     * if (this.health <= 0) {
     *   this.remove()
     * }
     */
    remove() {

    }
}