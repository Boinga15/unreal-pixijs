import { IMediaInstance, sound } from "@pixi/sound";
import { Game } from "..";

/**
 * A sound object that can be stopped, restarted, and have its volume changed. Best used for music or looping sounds.
 */
export class SoundObject {
    /**
     * A reference to the main game 
    */
    game: Game

    /**
     * The name of the sound being played. If changed, will not update the sound that is being played.
    */
    soundName: string;

    /**
     * The volume of the sound being played.
    */
    volume: number;

    /**
     * Whether or not the sound is looping.
    */
    looping: boolean;

    // Variables used for volume fading.
    private ogFadeTime: number = 0
    private fadeTime: number = 0
    private startVolume: number = 0
    private targetVolume: number = 0

    // A reference to the Pixi JS sound.
    private soundInstance: IMediaInstance | null = null;

    constructor(
        game: Game,
        soundReference: string,
        settings: { volume?: number; looping?: boolean; autoplay?: boolean } = {}
    ) {
        this.game = game;

        this.soundName = soundReference;
        this.volume = settings.volume ?? 1.0;
        this.looping = settings.looping ?? false;

        if (settings.autoplay ?? true) {
            this.play();
        }
    }

    /** Start playing (or replay if stopped). */
    play() {
        const result = sound.play(this.soundName, {
            volume: this.volume,
            loop: this.looping,
        });

        if (result instanceof Promise) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            async () => {
                this.soundInstance = await result;
            }
        } else {
            this.soundInstance = result;
        }
    }

    /** Destroy the sound object and stop it in the process. */
    destroy() {
        this.stop();
        this.game.sounds = this.game.sounds.filter((cSound) => cSound !== this);
    }

    /** Stop playback. */
    stop() {
        this.soundInstance?.stop();
        this.soundInstance = null;
    }

    /** Replay from start. */
    replay() {
        this.stop();
        this.play();
    }

    cancelFade() {
        this.fadeTime = 0;
    }

    /** Fade volume smoothly over time. */
    fadeVolume(target: number, duration: number) {
        if (!this.soundInstance) return;

        this.startVolume = this.soundInstance.volume;
        this.targetVolume = Math.max(0, target);

        this.ogFadeTime = duration;
        this.fadeTime = duration;
    }

    /** Set playback speed (1 = normal playback speed). */
    setSpeed(speed: number) {
        if (this.soundInstance) {
            this.soundInstance.speed = speed;
        }
    }

    /** Whether a sound instance exists and is playing/paused. */
    get isReady() {
        return this.soundInstance !== null;
    }

    /**
     * General update function for sounds, mainly used to handling fade and the volume control.
     * @param deltaTime The time between this frame and the last frame in milliseconds.
     */
    update(deltaTime: number) {
        // Fade
        if (this.fadeTime > 0) {
            this.fadeTime = Math.max(0, this.fadeTime - deltaTime);
            this.volume = this.startVolume + (this.targetVolume - this.startVolume) * ((this.ogFadeTime - this.fadeTime) / this.ogFadeTime);
        }

        if (this.soundInstance) {
            this.volume = Math.max(0, this.volume);
            this.soundInstance.volume = this.volume;
        }
    }
}