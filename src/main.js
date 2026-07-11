// main.js
// This is the main game script. It sets up the Phaser game and draws our
// tiny tile map (see map.js) using colored squares as placeholders for
// real pixel art we'll add later.

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
  // Draw the tile map: go through every row and column of MAP_GRID (from
  // map.js) and draw one colored square for each tile.
  for (let row = 0; row < MAP_HEIGHT; row++) {
    for (let col = 0; col < MAP_WIDTH; col++) {
      const tileType = MAP_GRID[row][col];
      const color = TILE_COLORS[tileType];

      // Each tile's top-left corner is at (col * TILE_SIZE, row * TILE_SIZE).
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      // Phaser draws rectangles from their CENTER point, so we shift by
      // half a tile to line them up neatly into a grid with no gaps.
      this.add.rectangle(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, color);
    }
  }
}

// update() runs continuously, about 60 times per second, for as long as the
// game is running. This is where movement and game logic will happen later.
function update() {}

// This line actually creates the game using the settings above.
const game = new Phaser.Game(config);
