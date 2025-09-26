import { Application, Graphics, Rectangle } from "pixi.js"
import { Actor, Level, Script, SoundObject, Widget } from "..";
import { sound } from "@pixi/sound";

// Constructors used to globally allow for any class to be created.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorConstructor<T extends Actor = Actor> = new (...args: any[]) => T; 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ScriptConstructor<T extends Script = Script> = new (...args: any[]) => T; 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WidgetConstructor<T extends Widget = Widget> = new (...args: any[]) => T; 

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
     * Mouse position relative to the game area. (0, 0) is considered the top-left corner of the screen. This is NOT relative to the camera, and is best used for widgets. If you need the mouse position in the level itself, use the mousePos found in level.
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

    /**
     * A list of persistant widgets currently present in the game. These widgets are updated every frame, and aren't removed when a new level is loaded. Add widgets to this list through "addPersistantWidget", and remove them with "removePersistantWidget".
    */
    persistantWidgets: Widget[] = []

    /**
     * A list of sound objects currently playing in the game. This list only tracks spawned sounds, not sounds played through playSound().
    */
    sounds: SoundObject[] = []

    constructor(gameWidth: number, gameHeight: number, soundLibrary: Record<string, string>, settings: {borderColour: string, backgroundColour: string} = {borderColour: "#000000", backgroundColour: "#383838ff"}) {
        // Define variables.
        this.app = new Application();
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;

        this.mousePos = {x: 0, y: 0};
        this.borderColour = settings.borderColour;
        this.backgroundColour = settings.backgroundColour;

        // Construct game window.
        this.boundingBox = new Graphics().rect(0, 0, this.gameWidth, this.gameHeight).fill(this.backgroundColour);
        this.app.stage.addChild(this.boundingBox);

        // Creating Mask
        this.mask = new Graphics().rect(0, 0, this.gameWidth, this.gameHeight).fill("#ffffff");
        this.app.stage.mask = this.mask;
        this.app.stage.addChild(this.mask);
        
        // Enable sounds
        try {
            sound.init();
            sound.add(soundLibrary, { preload: true })
        } catch (e) {
            console.log("Error encountered during sound load: " + e);
        }
    }

    /**
     * Adjusts the zIndexes of all actors and widgets currently on screen, taking into account their zOrder. Called automatically whenever an actor or widget is added/removed from the game or level. Also called once whenever a new level is loaded. The purpose of this function is to ensure that every loaded widget is rendered on top of every actor.
     */
    adjustZIndexes() {
        let highestZIndex = -Infinity;

        for (const actor of this.persistantActors) {
            actor.zIndex = actor.zOrder;

            if (actor.zOrder > highestZIndex) {
                highestZIndex = actor.zOrder;
            }
        }

        if (this.level) {
            for (const actor of this.level.actors) {
                actor.zIndex = actor.zOrder;

                if (actor.zOrder > highestZIndex) {
                    highestZIndex = actor.zOrder;
                }
            }
        }

        highestZIndex += 1;

        for (const widget of this.persistantWidgets) {
            widget.zIndex = highestZIndex + widget.zOrder;
        }

        if (this.level) {
            for (const widget of this.level.widgets) {
                widget.zIndex = highestZIndex + widget.zOrder;
            }
        }
    }

    /**
     * Plays a sound without creating a whole SoundObject instance. Best used for playing quick sound effects.
     * @param targetSound The ID of the sound to play.
     * @param settings Settings for the sound, including volume and whether or not the sound is looping or not.
     */
    playSound(targetSound: string, settings: {volume: number, looping: boolean} = {volume: 1.0, looping: false}) {
        if (!sound.exists(targetSound)) {
            console.warn(`[Unreal PixiJS] Attempted to play sound "${targetSound}", but this sound was never loaded at the start of the game.`);
            return;
        }
        
        if (settings.volume < 0) {
            settings.volume = 0;
        }

        sound.play(targetSound, {volume: settings.volume, loop: settings.looping});
    }

    /**
     * Creates and returns a new sound object. Best used for playing looping sounds or music.
     * @param targetSound The ID of the sound to play.
     * @param settings The settings of the sound, including volume, looping, and autoplay.
     * @returns An instance of the sound object.
     */
    spawnSound(targetSound: string, settings: {volume?: number, looping?: boolean, autoplay?: boolean} = {volume: 1.0, looping: false, autoplay: true}) {
        if (!sound.exists(targetSound)) {
            console.warn(`[Unreal PixiJS] Attempted to play sound "${targetSound}", but this sound was never loaded at the start of the game.`);
            return;
        }

        settings.volume = settings.volume ?? 1.0;
        
        if (settings.volume < 0) {
            settings.volume = 0;
        }

        const soundReference = new SoundObject(this, targetSound, {
            volume: settings.volume,
            looping: settings.looping,
            autoplay: settings.autoplay
        });

        this.sounds.push(soundReference);

        return soundReference;
    }

    /**
     * Stops all spawned sounds, removing them from the game's sound list as well as stopping the sounds. Also stops all sounds played through playSound().
     */
    stopAllSounds() {
        for (const sound of this.sounds) {
            sound.stop();
        }

        this.sounds = [];
        sound.stopAll();
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

                for (const actor of this.persistantActors) {
                    actor.update(time.deltaMS / 1000);
                }

                for (const widget of this.persistantWidgets) {
                    widget.update(time.deltaMS / 1000);
                }

                for (const sound of this.sounds) {
                    sound.update(time.deltaMS / 1000);
                }
            });
        })();
    }

    /**
     * Load a level to the game. If another level is already loaded, that level becomes unloaded and the new one is loaded in its place. This function should be called at the very start of the game to load the first level.
     * @param level An object reference to the level the game should load.
     * @returns An object reference of the loaded level.
     * 
     * @example
     * this.currentLevel = this.game.loadLevel(new MainLevel(this.game))
     */
    loadLevel(level: Level): Level {
        if (this.level != undefined) {
            this.level.onUnload();
        }

        this.level = level;
        level.onLoad();

        this.adjustZIndexes();

        return level;
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

        this.boundingBox.clear().rect(0, 0, this.gameWidth, this.gameHeight).fill(this.backgroundColour);
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
        this.adjustZIndexes();
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
        this.adjustZIndexes();
        return true;
    }

    /**
     * Removes all persistant actors currently loaded into the game, calling their remove() functions.
     */
    removeAllPersistantActors() {
        for (const actor of this.persistantActors) {
            actor.remove();
        }

        this.adjustZIndexes();
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

    /**
     * Obtains all persistant actors who implement a script of the given class.
     * @param targetScriptClass The script class to query using. If a script has children scripts, then querying for the parent script will also query for the children script.
     * @returns A list of persistant actors who all
     */
    getPersistantActorsImplementingScript<T extends Script>(targetScriptClass: ScriptConstructor<T>): Actor[] {
        return this.persistantActors.filter((actor) => actor.getScript(targetScriptClass) != undefined);
    }

    /**
     * Adds a widget to the game as a persistant widget, calling onConstruct as well for that widget.
     * @param newWidget An object reference to the widget that should be added to the level.
     * @returns A reference to the widget object that was just added.
     */
    addPersistantWidget(newWidget: Widget): Widget {
        this.persistantWidgets.push(newWidget);
        newWidget.isPersistant = true;
        newWidget.onConstruct();
        this.adjustZIndexes();

        return newWidget;
    }

    /**
     * Remove the given widget from the list of persistant widgets.
     * @param targetWidget A reference to the widget object that you want to remove from the level.
     * @returns A boolean. True if the widget was successfully removed, false otherwise.
     */
    removePersistantWidget(targetWidget: Widget): boolean {
        if (this.persistantWidgets.includes(targetWidget)) {
            targetWidget.deconstructWidget();
            this.adjustZIndexes();
            return true;
        }

        return false;
    }

    /**
     * Removes all persistant widgets within the game class, running their deconstruct functions before removing them.
     */
    removeAllPersistantWidgets() {
        for (const widget of this.persistantWidgets) {
            widget.deconstructWidget();
        }

        this.adjustZIndexes();
    }

    /**
     * Gets all persistant widgets that have the given class, or is a child of the given class.
     * @param targetWidget The class to query through.
     * @returns A list of every persistant widget with the given class or a child of the given class.
     */
    getPersistantWidgetsOfClass<T extends Widget>(targetWidgetType: WidgetConstructor<T>): T[] {
        return this.persistantWidgets.filter((widget): widget is T => widget instanceof targetWidgetType);
    }

    /**
     * Gets the first persistant widget that is an object of the given class or
     * @param targetWidgetType The widget class to query for.
     * @returns Either the first persistant widget which is an object of the class or a child of the class, or undefined if nothing was found.
     */
    getPersistantWidgetOfClass<T extends Widget>(targetWidgetType: WidgetConstructor<T>): T | undefined {
        for (const widget of this.persistantWidgets) {
            if (widget instanceof targetWidgetType) {
                return widget;
            }
        }

        return undefined;
    }

    /**
     * Checks if two points are colliding based on their locations on the game stage.
     * @param point1 The x and y coordinates of the first point.
     * @param point2 The x and y coordinates of the second point.
     * @returns A boolean. True if the two points are colliding (they have the same coordinates), false otherwise.
     */
    pointToPointCollision(point1: {x: number, y: number}, point2: {x: number, y: number}): boolean {
        return (point1.x == point2.x) && (point1.y == point2.y);
    }

    /**
     * Checks if a point is contained within a given rectangular area on the game stage.
     * @param point The x and y coordinates of the point.
     * @param rect The x and y coordinates of the top-left corner of the rectangle, as well as the xSize and the ySize of the rectangle.
     * @returns A boolean. True if the point is contained withing the rectangle, false otherwise.
     */
    pointToRectCollision(point: {x: number, y: number}, rect: {x: number, y: number, xSize: number, ySize: number}): boolean {
        return ((point.x - rect.x) >= 0) && ((point.y - rect.y) >= 0) && ((point.x - rect.x) <= rect.xSize) && ((point.y - rect.y) <= rect.ySize);
    }

    /**
     * Checks if two rectangles are colliding or not.
     * @param rect1 The x, y, xSize, and ySize of the first rectangle.
     * @param rect2 The x, y, xSize, and ySize of the second rectangle.
     * @returns A boolean. True if the two rectangles are colliding, false otherwise.
     */
    rectToRectCollision(rect1: {x: number, y: number, xSize: number, ySize: number}, rect2: {x: number, y: number, xSize: number, ySize: number}): boolean {
        return (rect1.x <= rect2.x + rect2.xSize) && (rect1.x + rect1.xSize >= rect2.x) && (rect1.y <= rect2.y + rect2.ySize) && (rect1.y + rect1.ySize >= rect2.y);
    }
    
    /**
     * Returns the squared distance between two given points.
     * @param point1 The x and y coordinates of the first point.
     * @param point2 The x and y coordinates of the second point.
     * @returns The squared distance between the two points.
     */
    getSquaredDistance(point1: {x: number, y: number}, point2: {x: number, y: number}): number {
        return (point1.x - point2.x)**2 + (point1.y - point2.y)**2;
    }

    /**
     * Returns the distance between two given points. Uses square root, and thus may be less efficient than getSquaredDistance.
     * @param point1 The x and y coordinates of the first point.
     * @param point2 The x and y coordinates of the second point.
     * @returns The distance between the two points.
     */
    getDistance(point1: {x: number, y: number}, point2: {x: number, y: number}): number {
        return Math.sqrt(this.getSquaredDistance(point1, point2));
    }

    /**
     * Obtains the angle between point2 and point1, returning it in radians. If the two points are colliding, then 0 rad is returned by default, which points horizontally to the right.
     * @param point1 The x and y coordiantes of the first point.
     * @param point2 The x and y coordinates of the second point.
     * @returns The angle of point 2 from point 1 measured in radians as it would be on a cartesian grid. 0 rad is horizontal to the right, pi/2 rad is straight up, and so on.
     */
    getAngle(point1: {x: number, y: number}, point2: {x: number, y: number}): number {
        const xDiff = point2.x - point1.x;
        const yDiff = point2.y - point1.y;

        let angle = (yDiff >= 0 ? Math.PI / 2 : (Math.PI * 3) / 2);

        if (xDiff != 0) {
            angle = Math.atan(yDiff / xDiff);

            if (xDiff <= 0) {
                angle += Math.PI;
            }
        }

        return angle;
    }

    /**
     * Converst a given angle in radians to a vector.
     * @param angle The angle in radians to convert.
     * @param magnitude The magnitude of the resultant vector (default is 1).
     * @returns The x and y components of the resultant vector.
     */
    angleToVector(angle: number, magnitude: number = 1): {x: number, y: number} {
        return {
            x: Math.cos(angle) * magnitude,
            y: Math.sin(angle) * magnitude
        };
    }
}