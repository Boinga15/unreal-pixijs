import { Game } from "../managers";
import { HealthScript } from "../scripts";
import { WidgetButton, WidgetText } from "../widgets";
import { ChildEnemy, Enemy, Level1, Level2, Level3, Player, TestScript, TestWidget1, TestWidget2, TestWidget3 } from "./resources";


// Base assertion function.
function assert(assertion: boolean, failMessage: string = "ASSERTION FAILED.") {
    if (assertion) {
        return;
    } else {
        throw new Error(failMessage);
    }
}

// Assertion Set #1 - Main Game Instance
const game = new Game(1000, 1000, {})

assert(game.gameWidth == 1000, "Assertion Failure - Game width is not 1000.");
assert(game.gameHeight == 1000, "Assertion Failure - Game height is not 1000.");

assert(game.backgroundColour == "#383838ff", "Assertion Failure - Game background isn't #383838ff");
game.changeBackgroundColour("#000000");
assert(game.backgroundColour == "#000000", "Assertion Failure - Game background isn't #000000.");

console.log("Assertion Set #1 passed.")


// Assertion Set #2 - Persistant Actors
game.addPersistantActor(new Player(game));
game.addPersistantActor(new Enemy(game));
game.addPersistantActor(new Enemy(game));
game.addPersistantActor(new ChildEnemy(game));
game.addPersistantActor(new ChildEnemy(game));

assert(game.persistantActors.length == 5, "Assertion Failure - There are only " + game.persistantActors.length.toString() + " persistant actors.");

const foundEnemies = game.getPersistantActorsOfClass(Enemy);
const foundChildEnemies = game.getPersistantActorsOfClass(ChildEnemy);

assert(foundEnemies.length == 4, "Assertion Failure - There are only " + foundEnemies.length.toString() + " enemies.");
assert(foundChildEnemies.length == 2, "Assertion Failure - There are only " + foundChildEnemies.length.toString() + " child enemies.");

const foundPlayer1 = game.getPersistantActorsOfClass(Player);
const foundPlayer2 = game.getPersistantActorOfClass(Player);
const foundSoloEnemy = game.getPersistantActorOfClass(Enemy);

assert(foundPlayer1.length == 1, "Assertion Failure - There are only " + foundPlayer1.length.toString() + " players.");
assert(foundPlayer1[0] == foundPlayer2, "Assertion Failure - The results of getPersistantActorOfClass and getPersistantActorsOfClass are different.");
assert(foundSoloEnemy == foundEnemies[0], "Assertion Failure - The results of foundSoloEnemy and foundEnemies[0] were different.")

game.removePersistantActor(foundSoloEnemy!);
game.removePersistantActor(foundPlayer2!);

assert(game.persistantActors.length == 3, "Assertion Failure - There are " + game.persistantActors.length.toString() + " after actor removal instead of three.");
assert(game.getPersistantActorsOfClass(Enemy).length == 3, "Assertion Failure - There are " + game.getPersistantActorsOfClass(Enemy).length.toString() + " after deletion.");

console.log("Assertion Set #2 passed.");


// Assertion Set #3 - Levels
game.loadLevel(new Level1(game));
assert(game.level != undefined, "Assertion Failuire - Level1 failed to load.");

let foundActors = game.level!.actors.length;
assert(foundActors == 2, "Assertion Failure - " + foundActors.toString() + " actors found in level instead of two.");

game.level!.addActor(new ChildEnemy(game));
foundActors = game.level!.actors.length;

assert(foundActors == 3, "Assertion Failure - " + foundActors.toString() + " actors found in level instead of three after insertion.");
assert(game.level!.getActorsOfClass(Enemy).length == 2, "Assertion Failure - " + game.level!.getActorsOfClass(Enemy).length.toString() + " enemies were found instead of two.");
assert(game.level!.getActorOfClass(Player) == game.level!.getActorsOfClass(Player)[0], "Assertion Failure - level.getActorOfClass and level.getActorsOfClass produced different results.");

game.level!.removeActor(game.level!.getActorOfClass(Player)!);
foundActors = game.level!.actors.length;

assert(foundActors == 2, "Assertion Failure - " + foundActors.toString() + " actors found in level instead of two after deletion.");
assert(game.level!.getActorOfClass(Player) == undefined, "Assertion Failure - Level contains Player actor after deletion.");


game.loadLevel(new Level2(game)); // Should also call the unload function for Level1, thus updating the background colour.


assert(game.backgroundColour == "#0f0f0f", "Assertion Failure - Game background isn't #0f0f0f");
assert(game.level!.getActorsOfClass(Player).length == 0, "Assertion Failure - Level contains Player after loading next level.");
assert(game.level!.getActorsOfClass(Enemy).length == 3, "Assertion Failure - " + game.level!.getActorsOfClass(Enemy).length.toString() + " enemies were found instead of three after level reload.");

console.log("Assertion Set #3 passed.");


// Assertion Set #4 - Actors
const persistantActor = game.persistantActors[0];
const regularActor = game.level!.actors[0];

assert(persistantActor.level == undefined, "Assertion Failure - Persistant actor has level defined as " + typeof(persistantActor.level) + ".");
assert(regularActor.level instanceof Level2, "Assertion Failure - Level actor has level type of " + typeof(regularActor.level));

assert(persistantActor.persistantActor, "Assertion Failure - Persistant actor isn't defined as persistant.");
assert(!regularActor.persistantActor, "Assertion Failure - Level actor is defiend as persistant.");

persistantActor.remove();
regularActor.remove();

assert(game.persistantActors.length == 2, "Assertion Failure - Persistant actor count is " + game.persistantActors.length.toString() + " instead of two after actor deletion.");
assert(game.level!.actors.length == 2, "Assertion Failure - Actor count is " + game.level!.actors.length.toString() + " instead of two after actor deletion.");

console.log("Assertion Set #4 passed.");


// Assertion Set #5 - Scripts
const targetActor = game.level!.actors[0];
targetActor.scripts.push(new TestScript(game, targetActor));

const persistantActorTarget = game.persistantActors[0];
persistantActorTarget.scripts.push(new TestScript(game, persistantActorTarget));

assert(game.getPersistantActorsImplementingScript(TestScript)[0] == persistantActorTarget, "Assertion Failure - Obtained script from game.implementingScript doesn't match created results.");
assert(game.level!.getActorsImplementingScript(TestScript)[0] == targetActor, "Assertion Failure - Obtained script from level.implementingScript doesn't match created results.");

assert(targetActor.getScript(TestScript) != undefined, "Assertion Failure - getScript didn't return the correct script.");
assert(targetActor.getScript(TestScript)!.isEnabled, "Assertion Failure - Scripts aren't automatically enabled on creation.");

console.log("Assertion Set #5 passed.")

// Assertion Set #6 - Widgets
game.level!.addWidget(new TestWidget1(game));
game.level!.addWidget(new TestWidget2(game));
game.level!.addWidget(new TestWidget2(game));

assert(game.level!.widgets.length == 3, "Assertion Failure - " + game.level!.widgets.length.toString() + " widgets found in level instead of three.");
assert(game.level!.getAllWidgetsOfClass(TestWidget2).length == 2, "Assertion Failure - " + game.level!.getAllWidgetsOfClass(TestWidget2).length.toString() + " instances of TestWidget2 found instead of two instances.");

game.level!.removeWidget(game.level!.getAllWidgetsOfClass(TestWidget1)[0]);
assert(game.level!.widgets.length == 2, "Assertion Failure - " + game.level!.widgets.length.toString() + " widgets found in level instead of two after deletion.");
assert(game.level!.getAllWidgetsOfClass(TestWidget2).length == 2, "Assertion Failure - " + game.level!.getAllWidgetsOfClass(TestWidget2).length.toString() + " instances of TestWidget2 found instead of two instances after deletion.");

const mainWidget = new TestWidget3(game);
const subWidget = new TestWidget1(game);
mainWidget.addSubWidget(subWidget);
mainWidget.addSubWidget(new TestWidget1(game));
mainWidget.addSubWidget(new TestWidget2(game));

game.level!.addWidget(mainWidget);

assert(game.level!.getWidgetOfClass(TestWidget3) === mainWidget, "Assertion Failure - getWidgetOfClass for level returns wrong result.");
assert(mainWidget.subWidgets.length == 3, "Assertion Failure - " + mainWidget.subWidgets.length.toString() + " sub-widgets found instead of three.");
assert(mainWidget.getAllSubWidgetsOfClass(TestWidget2).length == 1, "Assertion Failure - " + mainWidget.getAllSubWidgetsOfClass(TestWidget2).length.toString() + " instances of TestWidget2 found as subWidgets instead of one.");
assert(mainWidget.getSubWidgetOfClass(TestWidget1) === subWidget, "Assertion Failure - getWidgetOfClass for widget returns wrong result.");

mainWidget.removeSubWidget(subWidget);

assert(mainWidget.subWidgets.length == 2, "Assertion Failure - " + mainWidget.subWidgets.length.toString() + " sub-widgets found instead of two after deletion.");
assert(mainWidget.getAllSubWidgetsOfClass(TestWidget2).length == 1, "Assertion Failure - " + mainWidget.getAllSubWidgetsOfClass(TestWidget2).length.toString() + " instances of TestWidget2 found as subWidgets instead of one.");

game.addPersistantWidget(new TestWidget1(game));
game.addPersistantWidget(new TestWidget1(game));
game.addPersistantWidget(new TestWidget3(game));

assert(game.persistantWidgets.length == 3, "Assertion Failure - " + game.persistantWidgets.length.toString() + " persistant widgets found instead of three.");
assert(game.getAllPersistantWidgetsOfClass(TestWidget1).length == 2, "Assertion Failure - " + game.getAllPersistantWidgetsOfClass(TestWidget1).length.toString() + " instances of TestWidget1 found as persistant widgets instead of two.");
assert(game.getPersistantWidgetOfClass(TestWidget3) === game.getAllPersistantWidgetsOfClass(TestWidget3)[0], "Assertion Failure - getPersistantWidgetOfClass returns incorrect result.")

game.removePersistantWidget(game.getPersistantWidgetOfClass(TestWidget1)!);

assert(game.persistantWidgets.length == 2, "Assertion Failure - " + game.persistantWidgets.length.toString() + " persistant widgets found instead of two after deletion.");
assert(game.getAllPersistantWidgetsOfClass(TestWidget1).length == 1, "Assertion Failure - " + game.getAllPersistantWidgetsOfClass(TestWidget1).length.toString() + " instances of TestWidget1 found as persistant widgets instead of one after deletion.");

game.loadLevel(new Level1(game));

assert(game.persistantWidgets.length == 2, "Assertion Failure - " + game.persistantWidgets.length.toString() + " persistant widgets found instead of two after new level is loaded.");

console.log("Assertion Set #6 passed.");


// Assertion Set #7 - Pre-Created Assets
const newTextWidget = new WidgetText(game, 0, 0, {});
newTextWidget.updateFunction = (deltaTime: number, widgetReference: WidgetText) => {
    widgetReference.text = "Updated text alongside " + deltaTime.toString();
}

assert(newTextWidget.text === "Text Object", "Assertion Failure - Base value of text is " + newTextWidget.text + " and now 'Text Object'");

game.level!.addWidget(newTextWidget);
game.level!.update(1.0);

assert(newTextWidget.text === "Updated text alongside " + (1.0).toString(), "Assertion Failure - Update Function for WidgetText isn't called or is faulty, new text is " + newTextWidget.text);

const newButtonWidget = new WidgetButton(game, 0, 0, 100, 100, {});

newButtonWidget.clickFunction = (deltaTime: number, widgetReference: WidgetButton) => {
    widgetReference.label = "Updated text to " + deltaTime.toString();
}
newButtonWidget.heldFunction = (deltaTime: number, widgetReference: WidgetButton) => {
    widgetReference.xSize += 2 * deltaTime;
}
newButtonWidget.releasedFunction = (deltaTime: number, widgetReference: WidgetButton) => {
    widgetReference.xSize += 50 * deltaTime;
}

assert(newButtonWidget.label === "Button", "Assertion Failure - Base label of button isn't 'Button', and is instead " + newButtonWidget.label);
assert(newButtonWidget.xSize === 100, "Assertion Failure - Button initial size isn't 100 and is instead " + newButtonWidget.xSize.toString());

game.mousePos = {x: 50, y: 100};
newButtonWidget.update(1.0);

assert(newButtonWidget.label === "Button", "Assertion Failure - Label of button isn't 'Button' after first non-click test, and is instead " + newButtonWidget.label);

game.mousePos = {x: 250, y: 100};
game.mouseDown[0] = true;
newButtonWidget.update(1.0);

assert(newButtonWidget.label === "Button", "Assertion Failure - Label of button isn't 'Button' after second non-click test, and is instead " + newButtonWidget.label);

game.mousePos = {x: 100, y: 100};
newButtonWidget.update(1.0);

assert(newButtonWidget.label === "Updated text to 1", "Assertion Failure - Label of button isn't 'Update text to 1' after first click test, and is instead " + newButtonWidget.label);
assert(newButtonWidget.xSize === 100, "Assertion Failure - Button initial size isn't 100 and is instead " + newButtonWidget.xSize.toString() + " after first click.");

newButtonWidget.update(1.0);
assert(newButtonWidget.xSize == 102, "Assertion Failure - Button size isn't 102 and is instead " + newButtonWidget.xSize.toString() + " after first hold tick.");

game.mouseDown[0] = false;
newButtonWidget.update(1.0);
assert(newButtonWidget.xSize == 152, "Assertion Failure - Button size isn't 152 and is instead " + newButtonWidget.xSize.toString() + " after first release.");

game.mouseDown[0] = true;
newButtonWidget.update(1.0);

game.mousePos = {x: 250, y: 300};
newButtonWidget.update(1.0);
assert(newButtonWidget.xSize == 202, "Assertion Failure - Button size isn't 202 and is instead " + newButtonWidget.xSize.toString() + " after second release.");

const healthActor = new Player(game);
healthActor.scripts.push(new HealthScript(game, healthActor, 100));

const scriptReference = healthActor.getScript(HealthScript)!;

assert(scriptReference.health === 100, "Assertion Failure - Actor health is " + scriptReference.health.toString() + " instead of 100 on initialisation.");
assert(scriptReference.health === scriptReference.maxHealth, "Assertion Failure - Health Script max health isn't equal to health.");

scriptReference.rollingHealthSpeed = 0.8;
scriptReference.takeDamage(50);

assert(scriptReference.heldDamage === 50, "Assertion Failure - Held damage isn't 50 after taking 50 damage. Instead, it is " + scriptReference.heldDamage.toString());

scriptReference.update(1.0);

assert(scriptReference.heldDamage === 10, "Assertion Failure - Held damage isn't 10 after update by 1.0 seconds, instead it is " + scriptReference.heldDamage.toString());
assert(scriptReference.health === 60, "Assertion Failure - Health isn't 60 after update by 1.0 seconds, instead being " + scriptReference.health.toString());

scriptReference.update(2.0);

assert(scriptReference.heldDamage >= 0.4 && scriptReference.heldDamage <= 0.4001, "Assertion Failure - Held damage isn't 0.4 after update by 3.0 seconds, instead it is " + scriptReference.heldDamage.toString());
assert(scriptReference.health >= 50.4 && scriptReference.health <= 50.40001, "Assertion Failure - Health isn't 50.4 after update by 3.0 seconds, instead being " + scriptReference.health.toString());


console.log("Assertion Set #7 passed.");


// Assertion Set #8 - Mathematical Functions
let value = game.getSquaredDistance({x: 2, y: 4}, {x: -3, y: 6});
assert(value == 29, "Assertion Failure - getSquaredDistance returns " + value.toString() + " instead of 29.");

value = game.getDistance({x: 3, y: -2}, {x: 4, y: 6});
assert(Math.abs(value - 8) < 0.6226, "Assertion Failure - getDistance returns " + value.toString() + " instead of 8.06225");

value = game.getAngle({x: 2, y: 4}, {x: 2, y: 9});
assert(Math.abs(value - (Math.PI / 2)) <= 0.1, "Assertion Failure - getAngle for straight up results in value " + value.toString() + " instead of the half of PI.");

value = game.getAngle({x: 2, y: -5}, {x: 3, y:1});
assert(Math.abs(value - 1.4056) <= 0.1, "Assertion Failure - getAngle for angle set 2 returns " + value.toString() + " instead of 1.4056.");

value = game.getAngle({x: 3, y: 1}, {x: 2, y: -5});
assert(Math.abs(value - 4.5472) <= 0.1, "Assertion Failure - getAngle for angle set 3 returns " + value.toString() + " instead of 4.5472.");

let vector = game.angleToVector(0);
assert(vector.x === 1, "Assertion Failure - Resultant vector x from angle 0 is " + vector.x.toString() + " and not 1.");
assert(vector.y === 0, "Assertion Failure - Resultant vector y from angle 0 is " + vector.y.toString() + " and not 0.");

vector = game.angleToVector(Math.PI * (3 / 2), 3);
assert(-0.01 <= vector.x && vector.x <= 0.01, "Assertion Failure - Resultant vector x from angle 3PI/2 and magnitude 3 is " + vector.x.toString() + " and not 0.");
assert(vector.y === -3, "Assertion Failure - Resultant vector y from angle 3PI/2 and magnitude 3 is " + vector.y.toString() + " and not -3.");

vector = game.angleToVector(23, 2);
assert(-1.07 <= vector.x && vector.x <= -1.05, "Assertion Failure - Resultant vector x from angle 23 and magnitude 2 is " + vector.x.toString() + " and not -1.06.");
assert(-1.7 <= vector.y && vector.y <= -1.68, "Assertion Failure - Resultant vector y from angle 23 and magnitude 2 is " + vector.y.toString() + " and not -1.69.");

assert(game.pointToPointCollision({x: 3, y: 3}, {x: 3, y: 3}), "Assertion Failure - pointToPointCollision returns false for two points that have the same locations.");
assert(!game.pointToPointCollision({x: 3, y: 3}, {x: 3, y: 5}), "Assertion Failure - pointToPointCollision returns true for points with different coordinates (set #1).");
assert(!game.pointToPointCollision({x: 2, y: 5}, {x: 3, y: 5}), "Assertion Failure - pointToPointCollision returns true for points with different coordinates (set #2).");
assert(!game.pointToPointCollision({x: 2, y: 3}, {x: 3, y: 5}), "Assertion Failure - pointToPointCollision returns true for points with different coordinates (set #3).");

assert(game.pointToRectCollision({x: 3, y: 5}, {x: 2, y: 3, xSize: 5, ySize: 5}), "Assertion Failure - pointToRectCollision returns false for a point within a valid rectangle.");
assert(!game.pointToRectCollision({x: -5, y: -3}, {x: 2, y: 3, xSize: 100, ySize: 100}), "Assertion Failure - Point to the left and above rectangle is considered inside of the rectangle.");
assert(!game.pointToRectCollision({x: 6, y: 4}, {x: 2, y: 2, xSize: 3, ySize: 1}), "Assertion Failure - pointToRectCollision considers point to the right and below rectangle as in rectangle despite being clearly outside of it.");

assert(game.rectToRectCollision({x: 2, y: 4, xSize: 3, ySize: 5}, {x: 1, y: 5, xSize: 4, ySize: 5}), "Assertion Failure - rectToRectCollision returns false despite two rectangles being clearly inside each other.");
assert(!game.rectToRectCollision({x: 3, y: 3, xSize: 2, ySize: 3}, {x: 1, y: 7, xSize: 1, ySize: 3}), "Assertion Failure - rectToRectCollision returns true for two rectangles not overlapping in the slightest.");

console.log("Assertion Set #8 passed.");


// Assertion Set #9 - Z-Indexes
game.loadLevel(new Level3(game));

game.removeAllPersistantActors();
game.removeAllPersistantWidgets();

game.level!.addActor(new Player(game, 0, 0, 0));
game.level!.addActor(new Enemy(game, 0, 0, 2));
game.level!.addWidget(new WidgetText(game, 0, 0, {}, 0));

assert(game.level!.getActorOfClass(Enemy)!.zIndex === 2, "Assertion Failure - Enemy actor does not have correct zIndex of 2, instead having zIndex of " + game.level!.getActorOfClass(Enemy)!.zIndex.toString());
assert(game.level!.getWidgetOfClass(WidgetText)!.zIndex === 3, "Assertion Failure - Widget does not have correct zIndex of 3, instead having zIndex of " + game.level!.getWidgetOfClass(WidgetText)!.zIndex.toString());

game.addPersistantActor(new Player(game, 0, 0, 1));
game.addPersistantWidget(new WidgetText(game, 0, 0, {}, 2));

assert(game.getPersistantActorOfClass(Player)!.zIndex === 1, "Assertion Failure - Persistant instance of player doesn't have zIndex of 1, instead having a zIndex of " + game.getPersistantActorOfClass(Player)!.zIndex.toString());
assert(game.getPersistantWidgetOfClass(WidgetText)!.zIndex === 5, "Assertion Failure - Persistant instance of WidgetText doesn't have zIndex of 5, instead having a zIndex of " + game.getPersistantWidgetOfClass(WidgetText)!.zIndex.toString());

game.getPersistantActorOfClass(Player)!.setZOrder(3);
game.level!.getWidgetOfClass(WidgetText)!.setZOrder(5);

assert(game.getPersistantActorOfClass(Player)!.zIndex === 3, "Assertion Failure - Persistant instance of player after zIndex update doesn't have zIndex of 8, instead having a zIndex of " + game.getPersistantActorOfClass(Player)!.zIndex.toString());
assert(game.level!.getWidgetOfClass(WidgetText)!.zIndex === 9, "Assertion Failure - Widget does not have correct zIndex of 8 after zIndex update, instead having zIndex of " + game.level!.getWidgetOfClass(WidgetText)!.zIndex.toString());

console.log("Assertion Set #9 passed.");


// Assertion Set #10 - Actor Locations
const testActor = new Player(game, 0, 0);
testActor.update(1.0);

assert(testActor.getScreenLocation().x === 500, "Assertion Failure - Test Actor screen x location should be 500, but is instead " + testActor.getScreenLocation().x.toString());
assert(testActor.getScreenLocation().y === 500, "Assertion Failure - Test Actor screen y location should be 500, but is instead " + testActor.getScreenLocation().y.toString());

testActor.x = 100;
testActor.y = -200;
testActor.update(1.0);

assert(testActor.getScreenLocation().x === 600, "Assertion Failure - Test Actor screen x location should be 600, but is instead " + testActor.getScreenLocation().x.toString());
assert(testActor.getScreenLocation().y === 300, "Assertion Failure - Test Actor screen y location should be 300, but is instead " + testActor.getScreenLocation().y.toString());

assert(testActor.x === 100, "Assertion Failure - Test Actor absolute x location should be 100, but is instead " + testActor.getScreenLocation().x.toString());
assert(testActor.y === -200, "Assertion Failure - Test Actor absolute y location should be -200, but is instead " + testActor.getScreenLocation().y.toString());

console.log("Assertion Set #10 passed.");

console.log("All assertions passed.");