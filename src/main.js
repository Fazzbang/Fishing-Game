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
  // "Arcade Physics" is Phaser's simple built-in physics system. We turn it
  // on so we can use its automatic "don't let the player leave the map"
  // feature, instead of writing that math ourselves.
  physics: {
    default: 'arcade',
    arcade: {
      debug: false // set this to true later if we ever want to see collision boxes
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const PLAYER_SPEED = 120; // pixels per second the player moves when a key is held

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

  // The map is MAP_WIDTH x MAP_HEIGHT tiles, so its full size in pixels is:
  const mapPixelWidth = MAP_WIDTH * TILE_SIZE;
  const mapPixelHeight = MAP_HEIGHT * TILE_SIZE;

  // Tell the physics system where the "walls" of the world are. Anything
  // with collideWorldBounds turned on won't be able to cross this box.
  this.physics.world.setBounds(0, 0, mapPixelWidth, mapPixelHeight);

  // Create the player as a simple colored square, positioned on a grass
  // tile near the top-left of the map (column 2, row 6).
  const startX = 2 * TILE_SIZE + TILE_SIZE / 2;
  const startY = 6 * TILE_SIZE + TILE_SIZE / 2;
  this.player = this.add.rectangle(startX, startY, 24, 24, 0xffcc00);

  // this.physics.add.existing() upgrades our plain rectangle into one the
  // physics system can move around and check collisions for.
  this.physics.add.existing(this.player);
  this.player.body.setCollideWorldBounds(true); // can't leave the map bounds set above

  // createCursorKeys() gives us an object we can check every frame to see
  // if the up/down/left/right arrow keys are currently held down.
  this.cursors = this.input.keyboard.createCursorKeys();
}

// update() runs continuously, about 60 times per second, for as long as the
// game is running. Here we read the arrow keys and move the player.
function update() {
  // Start each frame assuming the player isn't moving, then turn on
  // whichever direction's key is currently held down.
  this.player.body.setVelocity(0, 0);

  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-PLAYER_SPEED);
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(PLAYER_SPEED);
  }

  if (this.cursors.up.isDown) {
    this.player.body.setVelocityY(-PLAYER_SPEED);
  } else if (this.cursors.down.isDown) {
    this.player.body.setVelocityY(PLAYER_SPEED);
  }
}

// This line actually creates the game using the settings above.
const game = new Phaser.Game(config);
