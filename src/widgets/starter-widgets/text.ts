import { Text } from "pixi.js";
import { Game } from "../../managers";
import { Widget } from "../widget";

/**
 * A type that holds the arguments WidgetText accepts as the "settings" attribute for the constructor function.
 */
export type WidgetTextArguments = {
    text?: string,
    anchor?: "left" | "center" | "right" | "justify",
    colour?: string,
    fontFamily?: string,
    fontSize?: number
}

/**
 * A sub-widget that allows you to display a line of text on the screen. Can be anchored and given a font of varying type and size. Similar to other pre-built widgets, this one has an "updateFunction" that lets you specify a unique update function for each WidgetText instance.
 */
export class WidgetText extends Widget {
    /**
     * A reference to the PixiJS text object that is actually going to be displayed.
    */
    private textObject: Text;

    /**
     * The text to be displayed. Default is "Text Object".
    */
    text: string;

    /**
     * The font that should be used for this text. Default is "Arial".
    */
    fontFamily: string;

    /**
     * The size of the font in pixels. Default is 16px.
    */
    fontSize: number;

    /**
     * The colour of the text.
    */
    colour: string;

    /**
     * The position through which the text is anchored, with its overall position being shifted such that the anchor lines up with the given X and Y coordinates.
    */
    anchor: "left" | "center" | "right" | "justify";

    /**
     * A custom update function that is called at the start of this widget's real update function. This function can be custom-defined in a way that this text naturally updates in a self-contained way.
     * 
     * @example
     * this.healthText.updateFunction = ((deltaTime: number, widgetReference: WidgetText) => {
     *  const playerRef = widgetReference.game.level!.getActorOfClass(Player);
     *  widgetReference.text = "Health: " + playerRef.health.toString();
     * });
    */
    updateFunction: (deltaTime: number, widgetReference: WidgetText) => void

    constructor(game: Game, x: number, y: number, settings: WidgetTextArguments = {}, updateFunction: (deltaTime: number, widgetReference: WidgetText) => void = (() => {})) {
        super(game);

        this.x = x;
        this.y = y;
        this.updateFunction = updateFunction;

        this.text = (settings.text ? settings.text : "Text Object");
        this.fontFamily = (settings.fontFamily ? settings.fontFamily : "Arial");
        this.fontSize = (settings.fontSize ? settings.fontSize : 16);
        this.colour = (settings.colour ? settings.colour : "#ffffff");
        this.anchor = (settings.anchor ? settings.anchor : "left");

        this.textObject = new Text({text: this.text, style: {
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            fill: this.colour,
            align: this.anchor
        }});

        this.addChild(this.textObject);
    }

    /**
     * The update function for this widget, called every frame. This widget calls this.updateFunction() at the start of its update function, before updating the shown text to match the given attributes.
     * @param deltaTime The time between this frame and the last frame in seconds.
     */
    update(deltaTime: number) {
        this.updateFunction(deltaTime, this);

        this.textObject.text = this.text;
        this.textObject.style.fontFamily = this.fontFamily;
        this.textObject.style.fontSize = this.fontSize;
        this.textObject.style.fill = this.colour;
        this.textObject.style.align = this.anchor;
    }
}