import { Container } from "pixi.js";
import { Game } from "../managers";
import { Level } from "../objects";

// Used for getting all actors and widgets of a class.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WidgetConstructor<T extends Widget = Widget> = new (...args: any[]) => T; 


/**
 * A widget acts as a UI widget that the player can interact with, as well as a static object which displays information. Widgets are different from actors, primarily because widgets support sub-widgets, and are meant to be used for UI elements rather than as physical actors in a level.
 */
export abstract class Widget extends Container {
    /**
     * A reference to the main game class that is running.
    */
    game: Game

    /**
     * A reference to the level that owns this widgets. If this is a sub-widget of another widget, then this will be undefiend.
    */
    level: Level | undefined

    /**
     * A reference to the widget that owns this widget. If this is a widget for the level, then this should be undefined.
    */
    owningWidget: Widget | undefined

    /**
     * A list of all of the sub-widgets that this widget contains.
    */
    subWidgets: Widget[] = []

    /**
     * Whether or not the widget is persistant, meaning it doesn't unload when the level unloads.
    */
    isPersistant: boolean = false

    /**
     * The relative zOrder of this widget compared to other actors and widgets.
    */
    zOrder = 0

    constructor(game: Game, x: number = 0, y: number = 0, zOrder: number = 0) {
        super();

        this.game = game;
        this.x = x;
        this.y = y;
        this.zOrder = zOrder;
    }

    /**
     * Called every frame to update the widget as well as its sub-widgets.
     * @param deltaTime The time in seconds between this frame and the previous frame.
     */
    update(deltaTime: number) {
        for (const subWidget of this.subWidgets) {
            subWidget.update(deltaTime);
        }
    }

    /**
     * Automatically called when a widget is added to a level or the game by the dedicated function. Effectively, this function is called the moment the widget is created.
     */
    onConstruct() {
        this.game.app.stage.addChild(this);
    }

    /**
     * A function called when this widget is deconstructed and removed from the level or game that it is attached to. Automatically called during this.removeWidget().
     */
    protected onDeconstruct() {
        this.game.app.stage.removeChild(this);

        if (this.isPersistant) {
            this.game.persistantWidgets = this.game.persistantWidgets.filter((widget) => widget !== this);
        }

        if (this.level != undefined) {
            this.level.widgets = this.level.widgets.filter((widget) => widget !== this);
        } else if (this.owningWidget != undefined) {
            this.owningWidget.subWidgets = this.owningWidget.subWidgets.filter((widget) => widget !== this);
        }
    }

    /**
     * Removes this widget from the game or level it is attached to, effectively destroying it and removing it from play.
     * 
     * @example
     * if (player.x >= 500) {
     *     widget1.removeWidget();
     * }
     */
    deconstructWidget() {
        // Deconstruct sub-widgets first.
        for (const widget of this.subWidgets) {
            widget.deconstructWidget();
        }

        this.onDeconstruct();
    }

    /**
     * Adds a given sub-widget object to this widget, correctly setting the sub-widgets owningWidget variable as well as calling its construct function in the process.
     * @param newSubwidget An object which is the sub-widget you wish to add.
     * @returns A reference to the new sub-widget.
     * 
     * @example
     * this.addSubWidget(new WidgetButton());
     */
    addSubWidget(newSubwidget: Widget) {
        newSubwidget.owningWidget = this;
        this.subWidgets.push(newSubwidget);
        newSubwidget.onConstruct();

        return newSubwidget;
    }

    /**
     * Removes a given sub-widget object from this widget, calling deconstructWidget in the process.
     * @param targetSubWidget The target widget to remove by object reference.
     * @returns A boolean. True if the widget was successfully removed, false otherwise.
     */
    removeSubWidget(targetSubWidget: Widget): boolean {
        if (this.subWidgets.includes(targetSubWidget)) {
            targetSubWidget.deconstructWidget();
            return true;
        }

        return false;
    }

    /**
     * Gets all sub widgets in this widget that have the given class, or is a child of the given class.
     * @param targetWidget The class to query through.
     * @returns A list of every sub-widget currently in this widget with the given class or a child of the given class.
     */
    getAllSubWidgetsOfClass<T extends Widget>(targetWidgetType: WidgetConstructor<T>): T[] {
        return this.subWidgets.filter((subWidget): subWidget is T => subWidget instanceof targetWidgetType);
    }

    /**
     * Gets the first sub-widget in this widget that is an object of the given class or
     * @param targetWidgetType The widget class to query for.
     * @returns Either the first sub-widget in this widget which is an object of the class or a child of the class, or undefined if nothing was found.
     */
    getSubWidgetOfClass<T extends Widget>(targetWidgetType: WidgetConstructor<T>): T | undefined {
        for (const subWidget of this.subWidgets) {
            if (subWidget instanceof targetWidgetType) {
                return subWidget;
            }
        }

        return undefined;
    }

    /**
     * Sets the zOrder of the widget, and calls game.adjustZIndexes as well in order to correctly update the zIndexes of this widget as well as every other actor and widget.
     * @param newZOrder 
     */
    setZOrder(newZOrder: number) {
        this.zOrder = newZOrder;
        this.game.adjustZIndexes();
    }
}