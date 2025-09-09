import { Actor, Level } from "../objects";
import { Script } from "../scripts";
import { Widget } from "../widgets";

export class Player extends Actor {}

export class Enemy extends Actor {}
export class ChildEnemy extends Enemy {}


export class Level1 extends Level {
    onLoad() {
        super.onLoad();

        this.addActor(new Player(this.game));
        this.addActor(new Enemy(this.game));
    }

    onUnload() {
        super.onUnload();

        this.game.changeBackgroundColour("#0f0f0f");
    }
}

export class Level2 extends Level {
    onLoad() {
        super.onLoad();

        this.addActor(new ChildEnemy(this.game));
        this.addActor(new ChildEnemy(this.game));
        this.addActor(new ChildEnemy(this.game));
    }
}


export class Level3 extends Level {}


export class TestScript extends Script {
    update(deltaTime: number): void {
        console.log(deltaTime);
    }
}


export class TestWidget1 extends Widget {}
export class TestWidget2 extends Widget {}
export class TestWidget3 extends Widget {}