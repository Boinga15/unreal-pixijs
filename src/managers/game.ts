import { Application, Graphics, Rectangle } from "pixi.js"
import { Actor, Level } from "..";

// Constructors used to globally allow for any class to be created.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorConstructor<T extends Actor = Actor> = new (...args: any[]) => T; 

/**
 * The main game class. Should be passed into every object used within the game that stems from Unreal PixiJS.
 * @category managers
 */

export class Game {
    /**
     * Refernce to the game application, containing the renderer and stage.
    */
    app: Application

    /**
     * The current level the game has loaded. If undefined, no level is currently loaded and nothing will happen. Call "loadLevel()" to load a level, as setting this variable directly may cause problems.
    */
    level: Level | undefined

    /**
     * The bounding box graphics for the game, stretching across the entire stage.
    */
    boundingBox: Graphics;

    /**
     * Mouse position relative to the game area. (0, 0) is considered the top-left corner of the screen.
    */
    mousePos: {x: number, y: number}

    /**
     * A list of mouse buttons currently being pressed. mouseDown[0] for left click, mouseDown[1] for middle mouse button, and mouseDown[2] for right click.
    */
    mouseDown: boolean[] = [false, false, false];

    /**
     * A list of keys that are being pressed. Use this to check for key inputs.
     * @example if(game.keys["KeyA"]) { ... }
     */
    keys: Record<string, boolean> = {};

    /**
     * A reference to the mask used to hide actors not within the game border.
    */
    mask: Graphics;

    /**
     * The unscaled width of the game. This is not the actual width of the game after being scaled to the browser window.
    */
    gameWidth: number

    /**
     * The unscaled height of the game. This is not the actual height of the game after being scaled to the browser window.
    */
    gameHeight: number

    /**
     * The colour of the outside borders for the game window.
    */
    borderColour: string = "#000000"

    /**
     * The colour of the game's background. In order to change the background colour during runtime, call the function "game.changeBackgroundColour()".
    */
    backgroundColour: string = "#383838ff";

    /**
     * A list of persistant actors currently present in the game. These actors are updated every frame, and are not removed when a new level is loaded. When adding or removing persistant actors, you should call "game.addPersistantActor()" or "game.removePersistantActor()" respsectively.
     */
    persistantActors: Actor[] = []

    constructor(gameWidth: number, gameHeight: number, borderColour: string = "#000000", backgroundColour = "#383838ff") {
        // Define variables.
        this.app = new Application();
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;

        this.mousePos = {x: 0, y: 0};
        this.borderColour = borderColour;
        this.backgroundColour = backgroundColour;

        // Construct game window.
        this.boundingBox = new Graphics().rect(0, 0, this.gameWidth, this.gameHeight).fill(this.backgroundColour);
        this.app.stage.addChild(this.boundingBox);

        // Creating Mask
        this.mask = new Graphics().rect(0, 0, this.gameWidth, this.gameHeight).fill("#ffffff");
        this.app.stage.mask = this.mask;
        this.app.stage.addChild(this.mask);
    }

    /**
     * Called to start the main game loop, as well as begin registering keyboard and mouse input.
     */
    beginGame(): void {
        (async () => {
            await this.app.init({ background: this.borderColour, resizeTo: window });

            this.app.stage.eventMode = "static";
            this.app.stage.hitArea = new Rectangle(0, 0, this.gameWidth, this.gameHeight);

            document.getElementById("pixi-container")!.appendChild(this.app.canvas);

            // Add resize listener
            window.addEventListener("resize", () => this.resize());
            this.resize();

            // Add key listeners.
            window.addEventListener("keydown", (e) => {
                this.keys[e.code] = true;
            });

            window.addEventListener("keyup", (e) => {
                this.keys[e.code] = false;
            });
            
            // Add mouse listeners
            window.addEventListener("mousedown", (e) => {
                this.mouseDown[e.button] = true;
            });

            window.addEventListener("mouseup", (e) => {
                this.mouseDown[e.button] = false;
            });

            // Prevent arrow keys from scrolling the page.
            window.addEventListener("keydown", (e) => {
                if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
                    e.preventDefault();
                }
            });
            
            // Prevent right click from opening the context menu.
            window.addEventListener("contextmenu", (e) => e.preventDefault());

            // Remove clicked mouse buttons when the window loses focus.
            window.addEventListener("blur", () => {
                this.mouseDown = [false, false, false];
            });

            // Handle mouse movement.
            window.addEventListener("mousemove", (e) => {
                const rect = this.app.canvas.getBoundingClientRect();

                this.mousePos = {
                    x: (e.clientX - rect.left - this.app.stage.x) / this.app.stage.scale.x,
                    y: (e.clientY - rect.top - this.app.stage.y) / this.app.stage.scale.y
                }
            })

            // The main game loop.
            this.app.ticker.add((time) => {
                this.level?.update(time.deltaMS / 1000);
            });
        })();
    }

    /**
     * Private function responsible for resizing the play area when the game window resizes.
     */
    private resize(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Resize the canvas to fit the window
        this.app.renderer.resize(windowWidth, windowHeight);

        const scaleX = windowWidth / this.gameWidth;
        const scaleY = windowHeight / this.gameHeight;
        const scale = Math.min(scaleX, scaleY);

        // Scale the stage
        this.app.stage.scale.set(scale);

        // Center the stage
        this.app.stage.x = (windowWidth - this.gameWidth * scale) / 2;
        this.app.stage.y = (windowHeight - this.gameHeight * scale) / 2;

        this.app.stage.hitArea = new Rectangle(0, 0, scale, scale);
    }

    /**
     * Change the background colour of the game to a different solid colour.
     * @param newColour The new colour for the background.
     */
    changeBackgroundColour(newColour: string): void {
        this.backgroundColour = newColour;

        this.boundingBox.clear().rect(0, 0, this.gameWidth, this.gameHeight).fill("#ffffff");
    }

    /**
     * Adds a persistant actor to the game.
     * @param actor An actor object, which is a reference to the actor you wish to add to the game.
     * @returns A reference to that actor object.
     * 
     * @example
     * this.playerReference = this.game.addPersistantActor(new Player());
     */
    addPersistantActor(actor: Actor): Actor {
        this.persistantActors.push(actor);
        actor.onCreate(true, undefined);
        return actor;
    }

    /**
     * Removes an actor from the list of persistant actors, assuming said actor is on the list of persistant actors.
     * @param actor The actor you wish to remove by reference.
     * @returns Whether or not the actor was successfully removed (true if so, false otherwise).
     * 
     * @example
     * for (const actor of this.game.persistantActors) {
     *   if (actor.x <= -200) {
     *     this.game.removePersistantActor(actor);
     *   }
     * }
     */
    removePersistantActor(actor: Actor): boolean {
        if(!this.persistantActors.includes(actor)) {
            return false;
        }

        actor.onRemove();
        this.persistantActors = this.persistantActors.filter((cActor) => cActor !== actor);
        return true;
    }

    /**
     * Obtains all persistant actors of a given class, including actors who's class is a child of the given class.
     * @param targetClass The class to search for.
     * @returns A list of object references for every actor in the game's persistant actor list who has the given class.
     * 
     * @example
     * this.managers = this.game.getPersistantActorsOfClass(Manager);
     */
    getPersistantActorsOfClass<T extends Actor>(targetClass: ActorConstructor<T>): T[] {
        return this.persistantActors.filter((actor): actor is T => (actor instanceof targetClass));
    }

    /**
     * Obtains the first instace of an actor in the persistant actor list who is an object of the given class, or is an object of a child of the given class.
     * @param targetClass The class to search for.
     * @returns A reference of the first actor's object who matches the given class. If no such actor exists within the level, this function returns "undefined" instead.
     * 
     * @example
     * this.areaManager = getPersistantActorOfClass(AreaManager);
     * this.areaManager?.updateArea();
     */
    getPersistantActorOfClass<T extends Actor>(targetClass: ActorConstructor<T>): T | undefined {
        for (const actor of this.persistantActors) {
            if (actor instanceof targetClass) {
                return actor;
            }
        }

        return undefined;
    }
}