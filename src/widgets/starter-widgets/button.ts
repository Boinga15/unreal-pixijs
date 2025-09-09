import { Graphics, Text } from "pixi.js";
import { Game } from "../../managers";
import { Widget } from "../widget";

/**
 * The arguments used by Button Widgets, all of which are optional and have default values if not passed into a WidgetButton.
 */
export type WidgetButtonArguments = {
    label?: string,
    textAnchor?: "left" | "center" | "right",
    textColour?: string,
    textFontFamily?: string,
    textFontSize?: number,
    buttonColour?: string,
    hoverColour?: string,
    clickColour?: string,
    disabledColour?: string,
    disabled?: boolean,
    updateFunction?: (_deltaTime: number, _widgetReference: WidgetButton) => void,
    clickFunction?: (_deltaTime: number, _widgetReference: WidgetButton) => void,
    heldFunction?: (_deltaTime: number, _widgetReference: WidgetButton) => void,
    releasedFunction?: (_deltaTime: number, _widgetReference: WidgetButton) => void,
}

/**
 * A simple button element that can be clicked, held, and released to call various functions. Can also be disabled and enabled if necessary.
 */
export class WidgetButton extends Widget {
    /**
     * The width of the button.
    */
    xSize: number

    /**
     * The height of the button.
    */
    ySize: number

    /**
     * The text displayed inside of the button.
    */
    label: string

    /**
     * The anchor of the text within the button itself.
    */
    textAnchor: "left" | "center" | "right"

    /**
     * The colour of the text within the button.
    */
    textColour: string

    /**
     * The font of the text within the button.
    */
    textFontFamily: string

    /**
     * The size of the font used for the text within the button.
    */
    textFontSize: number

    /**
     * The colour of the button assuming nothing is happening (it isn't disabled or being held).
    */
    buttonColour: string

    /**
     * The colour of the button when the mouse cursor hovers over the button, but doesn't click it.
    */
    hoverColour: string

    /**
     * The colour of the button when the mouse cursors hovers over and clicks it.
    */
    clickColour: string

    /**
     * The colour of the button while it's disabled.
    */
    disabledColour: string

    /**
     * Whether or not the button is disabled. A disabled button does not call any functions other than the updateFunction.
    */
    disabled: boolean

    /**
     * A reference to the displayed text widget on the button.
    */
    textWidget: Text

    /**
     * The function called at the start of this button's main update function. Best used to update the status and function of the buttons depending on the game state.
     * 
     * @example
     * button.updateFunction = (delatTime: number, widgetReference: WidgetButton) => {
     *  widgetReference.disabled = widgetReference.game.level!.getAllActorsOfClass(Enemy).length > 3;
     * }
    */
    updateFunction: (deltaTime: number, widgetReference: WidgetButton) => void

    /**
     * The function called when the button is clicked and not disabled.
     * 
     * @example
     * button.clickFunction = (deltaTime: number, widgetReference: WidgetButton) => {
     *  const playerReference = widgetReference.game.getPersistantActorOfClass(Player)!;
     * 
     *  if (playerReference.gold > 100) {
     *   playerReference.powerUpgrade += 1;
     *   playerReference.gold -= 100;
     *  }
     * }
    */
    clickFunction: (deltaTime: number, widgetReference: WidgetButton) => void

    /**
     * The function called while the button is held down. This function is not called on the first frame the button is clicked (instead, clickFunction is called in its place).
     * 
     * @example
     * button.heldFunction = (deltaTime: number, widgetReference: WidgetButton) => {
     *  const managerReference = this.game.getPersistantActorOfClass(Manager);
     *  managerReference.holdTime += 1;
     * 
     *  widgetReference.label = "Hold Time: " + managerReference.holdTime.toString();
     * }
    */
    heldFunction: (deltaTime: number, widgetReference: WidgetButton) => void

    /**
     * The function called when the button is released. As in, it was being clicked, and then either the mouse is moved off of the button, or the player stops clicking on the button.
     * 
     * @example
     * button.releasedFunction = (deltaTime: number, widgetReference: WidgetButton) => {
     *  const managerReference = this.game.getPersistantActorOfClass(Manager);
     *  managerRefernece.buttonHeld = false;
     * }
    */
    releasedFunction: (deltaTime: number, widgetReference: WidgetButton) => void

    /**
     * Whether or not this button is being clicked/held down or not.
    */
    isClicked: boolean = false

    /**
     * A direct reference to the visual rectangle used to display the button.
    */
    buttonRect: Graphics

    constructor(game: Game, x: number, y: number, xSize: number, ySize: number, settings: WidgetButtonArguments, zOrder: number = 0) {
        super(game, x, y, zOrder);

        this.xSize = xSize;
        this.ySize = ySize;

        this.label = (settings.label ? settings.label : "Button");
        this.textAnchor = (settings.textAnchor ? settings.textAnchor : "center");
        this.textColour = (settings.textColour ? settings.textColour : "#ffffff");
        this.textFontFamily = (settings.textFontFamily ? settings.textFontFamily : "Arial");
        this.textFontSize = (settings.textFontSize ? settings.textFontSize : 16);
        this.buttonColour = (settings.buttonColour ? settings.buttonColour : "#afafafff");
        this.hoverColour = (settings.hoverColour ? settings.hoverColour : "#a0a0a0ff");
        this.clickColour = (settings.clickColour ? settings.clickColour : "#636363ff");
        this.disabledColour = (settings.disabledColour ? settings.disabledColour : "#4e4e4eff");
        this.disabled = (settings.disabled ? settings.disabled : false);

        this.updateFunction = (settings.updateFunction ? settings.updateFunction : () => {});
        this.clickFunction = (settings.clickFunction ? settings.clickFunction : () => {});
        this.heldFunction = (settings.heldFunction ? settings.heldFunction : () => {});
        this.releasedFunction = (settings.releasedFunction ? settings.releasedFunction : () => {});
        
        this.buttonRect = new Graphics().rect(0, 0, this.xSize, this.ySize).fill(this.buttonColour);
        this.addChild(this.buttonRect);
    
        // Creating the text object.
        this.textWidget = new Text({text: this.label, style: {
            fill: this.textColour,
            fontSize: this.textFontSize,
            fontFamily: this.textFontFamily
        }});
        this.updateText();
        this.addChild(this.textWidget);
    }

    /**
     * A function responsible for updating the text with the 
     */
    private updateText() {
        if (this.textAnchor == "center") {
            this.textWidget.x = (this.xSize / 2);
            this.textWidget.y = (this.ySize / 2);
            this.textWidget.anchor.set(0.5);
        } else if (this.textAnchor == "left") {
            this.textWidget.x = 0;
            this.textWidget.y = 0;
            this.textWidget.anchor.set(0);
        } else {
            this.textWidget.x = this.xSize;
            this.textWidget.y = this.ySize;
            this.textWidget.anchor.set(1);
        }

        this.textWidget.style.fill = this.textColour;
        this.textWidget.style.fontSize = this.textFontSize;
        this.textWidget.style.fontFamily = this.textFontFamily;
        this.textWidget.text = this.label;
    }

    /**
     * The update function for the button that is called each frame.
     * @param deltaTime The time in seconds between this frame and the previous frame.
     */
    update(deltaTime: number) {
        super.update(deltaTime);
        
        this.updateFunction(deltaTime, this);
        let currentColour = this.buttonColour;

        if (this.disabled) {
            currentColour = this.disabledColour
        } else {
            if (this.isClicked) {
                if (!this.game.pointToRectCollision(this.game.mousePos, {x: this.x, y: this.y, xSize: this.xSize, ySize: this.ySize}) || !this.game.mouseDown[0]) {
                    this.releasedFunction(deltaTime, this);
                    this.isClicked = false;
                } else {
                    this.heldFunction(deltaTime, this);
                    currentColour = this.clickColour;
                }
            } else {
                if (this.game.pointToRectCollision(this.game.mousePos, {x: this.x, y: this.y, xSize: this.xSize, ySize: this.ySize}) && this.game.mouseDown[0]) {
                    this.clickFunction(deltaTime, this);
                    this.isClicked = true;
                    currentColour = this.clickColour;
                } else if (this.game.pointToRectCollision(this.game.mousePos, {x: this.x, y: this.y, xSize: this.xSize, ySize: this.ySize})) {
                    currentColour = this.hoverColour;
                }
            }
        }

        this.buttonRect.clear().rect(0, 0, this.xSize, this.ySize).fill(currentColour);
        this.updateText();
    }
}