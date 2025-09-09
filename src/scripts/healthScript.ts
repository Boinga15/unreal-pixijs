import { Actor, Game } from "..";
import { Script } from "./script";

/**
 * A simple health script that keeps track of an actor's health. Also implements basic health rolling (optional), as well as a function that can be run when the actor dies.
 */
export class HealthScript extends Script {
    /**
     * The maximum health the actor has. Should be a non-negative and non-zero number, else the actor will register instantly as killed.
    */
    maxHealth: number

    /**
     * The current health the actor has. Automatically set to the actor's maximum health upon loading this script.
    */
    health: number

    /**
     * The speed at which the actor's health decreases dependent on the damage dealt to the actor. Useful for creating smooth health bars. Capped between 0 and 1, with 0 meaning health never decreases, while 1 means there is no health rolling and damage instantly updates health. Normally set to 1. The value this is set to is the amount of damage compensated for in terms of decimal percentages every second.
    */
    rollingHealthSpeed: number = 1

    /**
     * The amount of damage this actor has left to manage.
    */
    heldDamage: number = 0

    /**
     * A function run per frame while this actor is dead (their health is zero). Normally, this just deletes the actor.
    */
    onDeath: (deltaTime: number, scriptReference: HealthScript) => void

    constructor(game: Game, owningActor: Actor, health: number, onDeath: (deltaTime: number, scriptReference: HealthScript) => void = (_deltaTime: number, scriptReference: HealthScript) => {
        scriptReference.owningActor.remove();
    }, rollingSpeed: number = 1) {
        super(game, owningActor);

        this.maxHealth = health;
        this.health = health;
        this.rollingHealthSpeed = rollingSpeed;
        this.onDeath = onDeath;
    }
    /**
     * The update function for the script, run during the update function of the actor that this script is attached to.
     * @param deltaTime The time between this frame and the previous frame in milliseconds.
     */
    update(deltaTime: number) {
        const rate = Math.min(1, Math.max(0, this.rollingHealthSpeed));

        // Exponential drain formula
        const fraction = 1 - Math.pow(1 - rate, deltaTime);
        const adjustAmount = this.heldDamage * fraction;

        this.health = Math.max(0, Math.min(this.maxHealth, this.health - adjustAmount));
        this.heldDamage -= adjustAmount;

        if (this.health <= 0) {
            this.onDeath(deltaTime, this);
        }
    }

    /**
     * Deals damage to the actor, increasing their held damage.
     * @param amount The amount of damage to deal. Negative numbers results in the actor healing.
     */
    takeDamage(amount: number) {
        this.heldDamage += amount;
    }
}