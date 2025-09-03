import { Game } from "../managers";
import { ChildEnemy, Enemy, Level1, Level2, Player, TestScript, TestWidget1, TestWidget2, TestWidget3 } from "./resources";


// Base assertion function.
function assert(assertion: boolean, failMessage: string = "ASSERTION FAILED.") {
    if (assertion) {
        return;
    } else {
        throw new Error(failMessage);
    }
}


// Assertion Set #1 - Main Game Instance
const game = new Game(1000, 1000)

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


console.log("All assertions passed.");