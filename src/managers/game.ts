import { Application, Graphics, Rectangle } from "pixi.js"
import { Level } from "..";

// Constructors used to globally allow for any level to be created.

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
     * 
    */
    mouseDown: boolean[] = [false, false, false];

    keys: Record<string, boolean> = {};

    mask: Graphics;

    gameWidth: number
    gameHeight: number
    borderColour: string = "#000000"

    constructor(gameWidth: number, gameHeight: number, borderColour: string = "#000000") {
        // Define variables.
        this.app = new Application();
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;

        this.mousePos = {x: 0, y: 0};
        this.borderColour = borderColour;

        // Construct game window.
        this.boundingBox = new Graphics().rect(0, 0, this.gameWidth, this.gameHeight).fill("#383838ff");
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
}