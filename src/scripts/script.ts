import { Game } from "../managers";
import { Actor } from "../objects";

/**
 * A script is a self-contained piece of code that can be attached to actors. Each script, when enabled, runs their "update" function once per game tick. The idea of scripts is that they make useful pieces of code reusable between several differing types of actors, such as health or movement.
 * 
 * @example
 * 
*/
export abstract class Script {
    game: Game
    owningActor: Actor
    isEnabled: boolean = true

    constructor(game: Game, owningActor: Actor) {
        this.game = game;
        this.owningActor = owningActor;
    }

    /**
     * The update function for the script, run during the update function of the actor that this script is attached to.
     * @param deltaTime The time between this frame and the previous frame in milliseconds.
     */
    abstract update(deltaTime: number): void;
}