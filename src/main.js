// main.js
// This is the very first script of our game. Right now it just proves that
// Phaser (the game engine) is working by opening a window with a solid
// green background and a line of text on it.

// A Phaser game always starts with a "config" object. Think of this as the
// game's settings sheet: how big is the screen, what color is the
// background, and which functions should Phaser call to set things up.
const config = {
  type: Phaser.AUTO,     // Let Phaser pick the best rendering method for the browser.
  width: 480,            // Screen width in pixels (15 tiles wide x 32 pixels per tile).
  height: 320,           // Screen height in pixels (10 tiles tall x 32 pixels per tile).
  backgroundColor: '#3fa34d', // A placeholder grass-green so we know the game booted.
  parent: 'game-container',   // The <div> in index.html where the game canvas will be placed.
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// preload() runs first. This is where we would load image files.
// We don't have any real art yet, so this is empty for now.
function preload() {}

// create() runs once, right after preload() finishes. This is where we set
// up anything that should exist when the game starts.
function create() {
  this.add.text(16, 16, 'Fishing RPG - Milestone 1', {
    fontSize: '16px',
    color: '#ffffff'
  });
}

// update() runs continuously, about 60 times per second, for as long as the
// game is running. This is where movement and game logic will happen later.
function update() {}

// This line actually creates the game using the settings above.
const game = new Phaser.Game(config);
