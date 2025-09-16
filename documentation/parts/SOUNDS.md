# Sound Objects
Sound objects are spawned by ```game.spawnSound```, and are used to hold and play sounds in the game that aren't meant to just play once, such as music.

## Important Variables
- ```soundName: string``` - The ID of the sound that the sound object is currently playing.

- ```volume: number``` - The volume of the sound object.

- ```looping: boolean``` - Whether or not the sound is looping.

## Useful Functions
- ```play()``` - Plays the sound. If the sound is set to auto-play, this function is called the moment the sound object is created.

- ```destroy()``` - Destroys the sound object, stopping it from playing in the process.

- ```stop()``` - Stops the sound object.

- ```replay()``` - Stops and restarts the sound object from the beginning.

- ```fadeVolume(target: number, duration: number)``` - Fades the volume of the sound object over a given period of time.

- ```cancelFade()``` - Stops any fade volume that this sound object is doing.

- ```setSpeed(speed: number)``` - Sets the speed of the sound object.

## Using Sound Objects
Creating and using sound objects is best done for anything that will be playing for a while, such as music. For example, you could have an actor which is responsible for handlnig the music of the game:

```ts
export class MusicManager extends Actor {
    soundObject: SoundObject | null = null

    constructor(game: Game) {
        super(game);
    }

    playMusic(musicID: string) {
        if (this.soundObject != null) {
            this.soundObject.destroy();
        }

        this.soundObject = this.game.spawnSound(musicID);
    }
}
```

For one-shot sounds, such as reloading or footsteps, it's better to play sounds through ```game.playSound``` rather than spawning a SoundObject.

## Browser Restrictions
As a reminder, most browsers don't allow websites to play sounds until the user has interacted with the website in some way (clicking into it, pressing a key while the website is focused, etc.). As a result, attempting to play a sound before any user interaction will result in weird behaviour as well as potentially causing errors. To prevent this from happening, therefore, it is highly recommended that you cfreate some sort of splash screen that shows at the start of the game, and prompts the user to click a button to continue. This way, there is some user interaction that happens before you play any sounds.