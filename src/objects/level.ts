import { Game } from "../managers";

export abstract class Level {
    game: Game

    constructor(game: Game) {
        this.game = game;
    }

    abstract update(deltaTime: number): void;

    onLoad() {}
    
    onUnload() {}
}