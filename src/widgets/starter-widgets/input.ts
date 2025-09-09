import { Graphics, Text, TextStyle } from "pixi.js";
import { Game } from "../../managers";
import { Widget } from "../widget";

/**
 * The arguments used for the WidgetInput element. Every argument is optional, and has default values if they are not supplied to the widget.
 */
export type WidgetInputArguments = {
    colour?: string,
    focusedColour?: string,
    placeholderText?: string,
    textColour?: string,
    textFont?: string,
    textFontSize?: number,
    numbersOnly?: boolean,
    updateFunction?: (_deltaTime: number, _widgetReference: WidgetInput) => void,
    onFocusedFunction?: (_deltaTime: number, _widgetReference: WidgetInput) => void
}

/**
 * A widget that attempts to simulate a standard text input box, letting the user click into it and either input numerical data or regular text data.
*/
export class WidgetInput extends Widget {
    /**
     * The width of the widget.
    */
    xSize: number

    /**
     * The height of the widget.
    */
    ySize: number

    /**
     * The rectangle used as the base of the widget.
    */
    inputRect: Graphics;

    /**
     * The caret displayed when the user is typing text.
    */
    caret: Graphics;

    /**
     * The text that is currently being displayed in the widget itself.
    */
    textWidget: Text;

    /**
     * The colour of the main widget box.
    */
    colour: string;

    /**
     * The colour of the main widget box when it is focused.
    */
    focusedColour: string;

    /**
     * The placeholder text shown when nothing is inputted.
    */
    placeholderText: string;

    /**
     * The colour of the text when something is typed into the widget.
    */
    textColour: string;

    /**
     * The font of the text, both the placeholder text and the inputted text.
    */
    textFont: string;

    /**
     * The font size of both the placeholder text and the inputted text.
    */
    textFontSize: number;

    /**
     * Whether or not this input should only accept numerical input.
    */
    numbersOnly: boolean;

    /**
     * The current value of the input widget.
    */
    value: string = "";

    /**
     * Whether or not this widget is focused or not.
    */
    isFocused: boolean = false;

    /**
     * The current indox of the caret with relation to the inputted text.
    */
    caretIndex: number = 0;

    /**
     * The time until the caret blinks again.
    */
    blinkTimer: number = 0;

    /**
     * The function called whenever the user focuses into the input widget.
    */
    onFocusedFunction: (deltaTime: number, widget: WidgetInput) => void;

    /**
     * The function called every time the update function for this widget is called, which is every frame.
    */
    updateFunction: (deltaTime: number, widget: WidgetInput) => void;

    constructor(game: Game, x: number, y: number, xSize: number, ySize: number, settings: WidgetInputArguments, zOrder: number = 0) {
        super(game, x, y, zOrder);

        this.xSize = xSize;
        this.ySize = ySize;

        this.colour = settings.colour ?? "#222222";
        this.focusedColour = settings.focusedColour ?? "#444444";
        this.placeholderText = settings.placeholderText ?? "Enter text...";
        this.textColour = settings.textColour ?? "#ffffff";
        this.textFont = settings.textFont ?? "Arial";
        this.textFontSize = settings.textFontSize ?? 16;
        this.numbersOnly = settings.numbersOnly ?? false;

        this.onFocusedFunction = settings.onFocusedFunction ?? (() => {});
        this.updateFunction = settings.updateFunction ?? (() => {});

        // Background rectangle
        this.inputRect = new Graphics().rect(0, 0, this.xSize, this.ySize).fill(this.colour);
        this.addChild(this.inputRect);

        // Text
        this.textWidget = new Text({text: this.placeholderText, style: {
            fontFamily: this.textFont,
            fontSize: this.textFontSize,
            fill: "#888888"
        }, anchor: {x: 0, y: 0.5}, x: 5, y: this.ySize / 2});
        this.addChild(this.textWidget);

        // Caret
        this.caret = new Graphics().rect(0, 0, 2, this.textFontSize).fill(this.textColour);
        this.caret.x = 5;
        this.caret.y = (this.ySize - this.textFontSize) / 2;
        this.addChild(this.caret);

        this.caret.visible = false;

        // Handle keyboard input globally
        try {
            window.addEventListener("keydown", (e) => {
                if (!this.isFocused) return;

                if (e.key === "Backspace") {
                    if (this.caretIndex > 0) {
                        this.value = this.value.slice(0, this.caretIndex - 1) + this.value.slice(this.caretIndex);
                        this.caretIndex--;
                    }
                } else if (e.key === "Delete") {
                    if (this.caretIndex < this.value.length) {
                        this.value = this.value.slice(0, this.caretIndex) + this.value.slice(this.caretIndex + 1);
                    }
                } else if (e.key === "ArrowLeft") {
                    if (this.caretIndex > 0) this.caretIndex--;
                } else if (e.key === "ArrowRight") {
                    if (this.caretIndex < this.value.length) this.caretIndex++;
                } else if (e.key === "Enter") {
                    this.isFocused = false;
                } else if (e.key.length === 1) {
                    if (this.numbersOnly && !/[0-9]/.test(e.key)) return;
                    this.value = this.value.slice(0, this.caretIndex) + e.key + this.value.slice(this.caretIndex);
                    this.caretIndex++;
                }
            });
        } catch (e) {
            console.log("Error encountered: " + e);
        }
    }

    /**
     * Measures the width of a given text with accordance to the text's widget.
     * @param text The input string the text is using.
     * @returns The width of the text in pixels.
     */
    private measureTextWidth(text: string): number {
        const style = new TextStyle({
            fontFamily: this.textFont,
            fontSize: this.textFontSize,
        });

        const temp = new Text({text: text, style: style});
        return temp.width;
    }

    /**
     * Given where the click is, find the location of where the caret should go.
     * @param localX The location of the click relative to the top-left corner of the widget box.
     * @returns The index where the caret should be placed.
     */
    private getCaretIndexFromClick(localX: number): number {
        for (let i = 1; i <= this.value.length; i++) {
            const substr = this.value.slice(0, i);
            const width = this.measureTextWidth(substr);
            if (width >= localX) {
                return i - 1;
            }
        }

        return this.value.length;
    }

    /**
     * The update function, called every frame.
     * @param deltaTime The time between this frame and the last frame.
     */
    update(deltaTime: number) {
        super.update(deltaTime);
        this.updateFunction(deltaTime, this);

        // Check for focus and unfocus.
        if (this.game.mouseDown[0]) {
            const rect = { x: this.x, y: this.y, xSize: this.xSize, ySize: this.ySize };

            if (this.game.pointToRectCollision(this.game.mousePos, rect)) {
                if (!this.isFocused) {
                    this.onFocusedFunction(deltaTime, this);
                }
                
                this.isFocused = true;

                // Set caret index based on click position
                const localX = this.game.mousePos.x - this.x - 5; // 5 = left padding
                this.caretIndex = this.getCaretIndexFromClick(localX);
            } else {
                this.isFocused = false;
            }
        }

        // Update background colour
        this.inputRect.clear().rect(0, 0, this.xSize, this.ySize).fill(
            this.isFocused ? this.focusedColour : this.colour
        );

        // Update text display
        if (this.value.length > 0) {
            this.textWidget.text = this.value;
            this.textWidget.style.fill = this.textColour;
        } else {
            this.textWidget.text = this.placeholderText;
            this.textWidget.style.fill = "#888888";
        }

        // Caret blink
        if (this.isFocused) {
            this.blinkTimer += deltaTime;
            if (Math.floor(this.blinkTimer * 2) % 2 === 0) {
                this.caret.visible = true;
            } else {
                this.caret.visible = false;
            }

            if (this.value.length > 0) {
                this.caret.x = 7 + this.measureTextWidth(this.value.slice(0, this.caretIndex));
            } else {
                this.caret.x = 7;
            }
        } else {
            this.caret.visible = false;
        }

        if (this.isFocused) {
            this.onFocusedFunction(deltaTime, this);
        }
    }
}