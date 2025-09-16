Widgets are used to create HUDs and menus, giving you an easy way to give the player information and make interactable buttons and inputs. Widgets can both be added directly to the game or level, and also be added to other widgets as sub-widgets.

## Important Variables
- ```game: Game``` - A reference to the root game class.

- ```level: Level | undefined``` - A reference to the level this widget is a part of. If this is undefined, then the widget is a persistant widget and is therefore not part of the level. If you wish to reference the level and not risk this being undefined, use ```game.level``` instead.

- ```isPersistant: boolean``` - Whether or not this widget is a persistant widget. Changing this boolean doesn't do anything, and thus this variable should be read-only.

- ```owningWidget: Widget | undefined``` - If this widget is a sub-widget, then this variable holds the owning widget. Otherwise, it's undefined.

- ```subWidgets: Widget[]``` - A list of sub-widgets in this widget.

- ```zOrder: number``` - The zOrder of this widget relative to other widgets. Regardless of what this is set to unless it is set to a negative number, this widget will be above every other widget.

## Useful Functions
- ```deconstructWidget()``` - Removes the widget from the game, also deleting all of its sub-widgets.

- ```addSubWidget(newSubwidget: Widget): Widget``` - Adds a sub-widget object to this widget, calling its onConstruct function as well. Returns the widget that was just added.

- ```removeSubWidget(targetSubWidget: Widget): boolean``` - Remvoes a given sub-widget object from this widget, calling its deconstructWidget method. Returns a boolean which is true if the sub-widget is successfully removed, and false otherwise.

- ```getSubWidgetsOfClass(targetWidgetType: Class of Type Widget): GivenClass[]``` - Gets every sub-widget in this widget which is of the given class type, or is of a child of the given class type. Returns an array which has the same type as targetWidgetType.

- ```getSubWidgetOfClass(targetWidgetType: Class of Type Widget): GivenClass | undefined``` - Gets the first sub-widget in this widget which is of the given class type, or is of a child of the given class type. If no such widget exists, then return undefined instead.

- ```setZOrder(newZOrder: number)``` - Sets the zOrder of the widget to a new value, also calling ```this.game.adjustZIndexes()```.

## Creating a New Widget
Creating a new widget is similar to creating a new actor, and follows a similar structure with some minor differences:

```ts
class NewWidget extends Widget {
    constructor(game: Game, x: number = 0, y: number = 0, zOrder: number = 0) {
        super(game, x, y, zOrder);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        // Your code goes here.
    }

    onConstruct() {
        super.onConstruct();
        // Your code goes here.
    }

    onDeconstruct() {
        // Your code goes here.
        super.onDeconstruct();
    }
}
```

Update is called every frame, onConstruct is called when the widget is created, and onDeconstruct is called when the widget is destroyed. As always, adding sub-widgets that are dependent on the main widget, as well as referencing other objects in the level, should usually be done in onConstruct() to prevent referencing errors.

## Actors vs Widgets
The key difference between actors and widgets is that widgets are attached to the user's screen, while actors have a position in the world. This means that moving the camera around will move actors around on the screen, but won't move any widgets on the screen.

Another difference is that widgets are automatically placed over actors in zOrder. If a widget has a zOrder of 0, and an actor has a zOrder of 2, then the widget will still be placed over the actor.

## Pre-made Widgets - Text
The ```WidgetText``` is a simple widget that displays a single line of text on the screen.

### Important Variables
- ```text: string``` - The text displayed on the widget.

- ```fontFamily: string``` - The font family the text has.

- ```fontSize: number``` - The size of the text's font.

- ```colour: string``` - The colour of the text.

- ```anchor: "left" | "center" | "right"``` - The alignment of the text, deciding which part of the text is aligned with the text's X and Y coordinates.

- ```updateFunction: (deltaTime: number, widgetReference: WidgetText) => void``` - A custom update function that is run every frame. This update function can be used to update the text in real-time, giving each text object its own unique update function.

### Arguments Type
When creating a new Text Object, the arguments of said Text Object can be found as the type ```WidgetTextArguments```:

```ts
export type WidgetTextArguments = {
    text: string,
    anchor: "left" | "center" | "right",
    colour: string,
    fontFamily: string,
    fontSize: number,
    updateFunction: (deltaTime: number, widgetReference: WidgetText) => void
}
```

All of these settings have default values, so if you don't provide one of these, its default will be used in its place.

## Pre-made Widgets - Button
The ```WidgetButton``` widget lets you create a simple button that has interactability and functions you can set to make various buttons do different things.

### Important Variables
- ```xSize: number``` - The width of the button.

- ```ySize: number``` - The height of the button.

- ```label: string``` - The label of the button.

- ```textAnchor: "left" | "center" | "right"``` - How the label of the button is anchored within the button itself.

- ```textColour: string``` - The colour of the button's label.

- ```textFontFamily: string``` - The font family of the button's label.

- ```textFontSize: number``` - The size of the font used for the button.

- ```buttonColour: string``` - The colour of the button.

- ```hoverColour: string``` - The colour of the button when the player hovers their mouse over it.

- ```clickColour: string``` - The colour of the button when it's being clicked.

- ```disabledColour: string``` - The colour of the button when its disabled.

- ```disabled: boolean``` - Whether or not the button is disabled. If it is disabled, then the button won't be interactable.

- ```updateFunction: (deltaTime: number, widgetReference: WidgetButton) => void``` - A function that is called every frame, letting you update this button depending on other things in the game.

- ```clickFunction: (deltaTime: number, widgetReference: WidgetButton) => void``` - A function called when the button is clicked. This is only run once every time the button is pressed.

- ```heldFunction: (deltaTime: number, widgetReference: WidgetButton) => void``` - A function called every frame the button is held down.

- ```releasedFunction: (deltaTime: number, widgetReference: WidgetButton) => void``` - A function called the first frame the button is released.

- ```isClicked: boolean``` - Whether or not the button is currently being held down.

### Arguments Type
When creating a new Text Object, the arguments of said Text Object can be found as the type ```WidgetButtonArguments```:

```ts
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
```

All of these settings have default values, so if you don't provide one of these, its default will be used in its place.

## Pre-made Widgets - Input
The ```WidgetInput``` class lets you create an input widget that the player can click into and enter a string into, setting its value. This is useful if you want to get textual input from the player.

### Important Variables
- ```xSize: number``` - The width of the input.

- ```ySize: number``` - The height of the input.

- ```colour: string``` - The colour of the input box.

- ```focusedColour: string``` - The colour of the input box when focused.

- ```placeholderText: string``` - The text shown in a grey colour when nothing has been inputted into the text box.

- ```textColour: string``` - The colour of the actual text.

- ```textFont: string``` - The font to use for the text.

- ```textFontSize: string``` - The size of the text's font.

- ```isFocused: boolean``` - Whether or not this widget is focused.

- ```value: string``` - The value of the input box.

- ```numbersOnly: boolean``` - Whether or not this input box only accepts numerical information.

- ```onFocusedFunction: (deltaTime: number, widget: WidgetInput) => void``` - A function that is run when the input is focused, only running on the first frame it is focused.

- ```updateFunction: (deltaTime: number, widget: WidgetInput) => void``` - A function that is run every frame, letting you dynamically and automatically update the input's properties.

### Arguments Type
When creating a new Text Object, the arguments of said Text Object can be found as the type ```WidgetInputArguments```:

```ts
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
```

All of these settings have default values, so if you don't provide one of these, its default will be used in its place.