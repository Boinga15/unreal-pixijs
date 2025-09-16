<p align="center">
    <img src="documentation/logo.png" style="width: 300px;" alt="Package icon." />
</p>

# Unreal PixiJS

## Overview
Unreal PixiJS is a framework for [PixiJS](https://github.com/pixijs/pixijs) that abstracts many things and allows for an easy-to-use object-orientated approach to programming games that is similar to how Unreal Engine 5 allows you to program games.

The framework currently allows for easy seperation of actors and widgets, simple level management, integrated camera and sound systems, and more that makes programming web games a lot easier.

## Features
- Heavy abstraction of many things, making it much easier to get started with while retaining the amount of features.
- An automatically-scaling game window that lets you ignore the problem of different screen sizes entirely.
- A pre-built actor system that automatically handles clean-up.
- A simple-to-use widget system that makes creating main menus or HUDs easy.
- A level system that makes sectioning your game into various screens or levels easy.
- In-built sound system and camera movement.
- An object-oriented programming style that's intuitive and easy to expand on.
- Scripts that let multiple different actors share functionality.
- Pre-built assets commonly used in games, such as buttons, input boxes, and health scripts.

## Requirements
- The latest version of NodeJS.
- NPM package manager.

## Installation
To get started with Unreal PixiJS, all you need to do is run the appropriate console command.

Open a terminal in a folder and type the following command:

```
npm create unrealpixijs@latest game_name
```

You can replace "game_name" with the name of your game folder. You can also add Unreal PixiJS to an existing project through:

```
npm install unreal-pixijs
```

For beginners, the create command is highly recommended. It will create a template which is easy to use and instantly allows you to start creating your game.

## Usage
Similar to PixiJS, simply going into the project folder and running "npm run dev" will start a localhost server where you can view your game and update it live. If you see a webpage with a green square and some text, then it's working.

Information on how to program your game, as well as where to get started, can be found in the "documentation" folder. I recommend starting with the ["Getting Started"](documentation/GETTING_STARTED.md) documentation file, as it will teach you the concepts used in Unreal PixiJS, as well as what to edit to start making your game.

## Contributions
Contributions to Unreal PixiJS are completely welcome. If you find a bug or have a feature request, feel free to get in touch (my contacts can be found on my webpage, <a href="https://alexnair.com">found here</a>), or start a new branch and implement it yourself. More information on how to contribute and advice when implementing new features or fixing bugs can be found on the [Contributing Gude](.github/CONTRIBUTING.md).

## License
Unreal PixiJS is released under the [MIT License](LICENSE.md).