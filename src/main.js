// main.js
// This is the main game script. It sets up the Phaser game and draws our
// tile map (see map.js) using real pixel art tile images from
// assets/tileset.png (grass, path, water, sand, flowers, fence).

// A Phaser game always starts with a "config" object. Think of this as the
// game's settings sheet: how big is the screen, what color is the
// background, and which functions should Phaser call to set things up.
const config = {
  type: Phaser.AUTO,     // Let Phaser pick the best rendering method for the browser.
  // The screen size is calculated from the map's dimensions (map.js), so
  // the game window always matches however big the map currently is.
  width: MAP_WIDTH * TILE_SIZE,
  height: MAP_HEIGHT * TILE_SIZE,
  backgroundColor: '#3fa34d', // Grass-green fallback, shown briefly before the map draws in.
  parent: 'game-container',   // The <div> in index.html where the game canvas will be placed.
  // Our art is drawn small (16x16) and scaled up - pixelArt keeps that
  // scaling crisp and blocky instead of blurry.
  pixelArt: true,
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

// preload() runs first and loads all our image files before anything else
// happens, so they're ready by the time create() tries to use them.
function preload() {
  // Our tileset is one image strip containing all 6 ground tiles side by
  // side, each 16x16 pixels. Loading it as a "spritesheet" lets us pick out
  // one tile by number (frame 0, frame 1, etc.) - and those numbers line up
  // exactly with the numbers used in MAP_GRID (map.js).
  this.load.spritesheet('tiles', 'assets/tileset.png', { frameWidth: 16, frameHeight: 16 });

  this.load.image('shack', 'assets/shack.png');
  this.load.image('player', 'assets/player.png');
}

// create() runs once, right after preload() finishes. This is where we set
// up anything that should exist when the game starts.
function create() {
  // Draw the tile map: go through every row and column of MAP_GRID (from
  // map.js) and place the matching tile image for each one.
  for (let row = 0; row < MAP_HEIGHT; row++) {
    for (let col = 0; col < MAP_WIDTH; col++) {
      const tileType = MAP_GRID[row][col];

      // Each tile's top-left corner is at (col * TILE_SIZE, row * TILE_SIZE).
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      // Phaser draws images from their CENTER point, so we shift by half a
      // tile to line them up neatly into a grid with no gaps. setDisplaySize
      // scales our 16x16 source art up to fill a 32x32 screen tile.
      this.add.image(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 'tiles', tileType)
        .setDisplaySize(TILE_SIZE, TILE_SIZE);
    }
  }

  // A decorative fishing shack, sitting on the grass near the top of the
  // map (spanning the 2x2 tile area at column 6-7, row 1-2). It's just a
  // picture - not something the player interacts with yet.
  const shackTileCol = 6;
  const shackTileRow = 1;
  const shackWidth = TILE_SIZE * 2;
  const shackHeight = TILE_SIZE * 2;
  this.add.image(
    shackTileCol * TILE_SIZE + shackWidth / 2,
    shackTileRow * TILE_SIZE + shackHeight / 2,
    'shack'
  ).setDisplaySize(shackWidth, shackHeight);

  // The map is MAP_WIDTH x MAP_HEIGHT tiles, so its full size in pixels is:
  const mapPixelWidth = MAP_WIDTH * TILE_SIZE;
  const mapPixelHeight = MAP_HEIGHT * TILE_SIZE;

  // Tell the physics system where the "walls" of the world are. Anything
  // with collideWorldBounds turned on won't be able to cross this box.
  this.physics.world.setBounds(0, 0, mapPixelWidth, mapPixelHeight);

  // Create the player, positioned on a grass tile near the top-left of the
  // map (column 2, row 6). physics.add.image() creates it already wired up
  // to the physics system, so it can move and collide with the map edges.
  const startX = 2 * TILE_SIZE + TILE_SIZE / 2;
  const startY = 6 * TILE_SIZE + TILE_SIZE / 2;
  this.player = this.physics.add.image(startX, startY, 'player').setDisplaySize(28, 28);
  this.player.body.setCollideWorldBounds(true); // can't leave the map bounds set above

  // createCursorKeys() gives us an object we can check every frame to see
  // if the up/down/left/right arrow keys are currently held down.
  this.cursors = this.input.keyboard.createCursorKeys();

  // The SPACE key (fishing) and F key (opening/closing the FishDex).
  this.spaceKey = this.input.keyboard.addKey('SPACE');
  this.fKey = this.input.keyboard.addKey('F');

  // Which way the player is currently facing ('up', 'down', 'left' or
  // 'right'). Starts facing down, like most Game Boy RPGs do.
  this.facing = 'down';

  // The in-memory list of every fish caught so far (no saving yet - this
  // resets if you refresh the page).
  this.caughtFish = [];

  // Center point of the screen, used below to position UI elements no
  // matter how big the map/canvas currently is.
  const screenCenterX = config.width / 2;
  const screenCenterY = config.height / 2;

  // Text that shows "Press SPACE to fish" when facing water. Hidden by
  // default; update() decides each frame whether to show it.
  this.fishPrompt = this.add.text(screenCenterX, 8, 'Press SPACE to fish', {
    fontSize: '14px',
    color: '#ffffff',
    backgroundColor: '#000000'
  }).setOrigin(0.5, 0).setVisible(false);

  // The "You caught a ...!" popup: a dark box with text on top of it.
  // Both start hidden and only appear right after a successful catch.
  this.catchBox = this.add.rectangle(screenCenterX, screenCenterY, 320, 60, 0x000000, 0.85).setVisible(false);
  this.catchText = this.add.text(screenCenterX, screenCenterY, '', {
    fontSize: '14px',
    color: '#ffffff',
    align: 'center',
    wordWrap: { width: 280 }
  }).setOrigin(0.5).setVisible(false);

  // The FishDex: a full-screen overlay listing every fish caught so far.
  // Toggled on/off with the F key. Starts closed.
  this.fishDexOpen = false;
  this.fishDexBox = this.add.rectangle(screenCenterX, screenCenterY, config.width - 40, config.height - 40, 0x000000, 0.92).setVisible(false);
  this.fishDexText = this.add.text(30, 20, '', {
    fontSize: '14px',
    color: '#ffffff',
    lineSpacing: 6
  }).setVisible(false);

  // Sets up the reeling minigame's visuals (see fishing_minigame.js). It
  // starts hidden and only appears while actually reeling in a fish.
  createFishingMinigameUI(this);
}

// Rebuilds the FishDex text from whatever fish have been caught so far.
function buildFishDexText(scene) {
  let text = 'FishDex (press F to close)\n\n';

  if (scene.caughtFish.length === 0) {
    text += 'No fish caught yet - go fish near the water!';
  } else {
    scene.caughtFish.forEach((fishName, index) => {
      text += (index + 1) + '. ' + fishName + '\n';
    });
  }

  return text;
}

// update() runs continuously, about 60 times per second, for as long as the
// game is running. Phaser passes it the current time and the delta (how
// many milliseconds passed since the last frame) - we need delta to move
// the reeling minigame's marker at a steady speed.
function update(time, delta) {
  // Pressing F opens or closes the FishDex (but not while mid-catch - that
  // would be a confusing time to check your collection).
  if (!this.fishingMinigame && Phaser.Input.Keyboard.JustDown(this.fKey)) {
    this.fishDexOpen = !this.fishDexOpen;
    this.fishDexBox.setVisible(this.fishDexOpen);
    this.fishDexText.setVisible(this.fishDexOpen);
    if (this.fishDexOpen) {
      this.fishDexText.setText(buildFishDexText(this));
    }
  }

  if (this.fishDexOpen) {
    this.player.body.setVelocity(0, 0);
    return;
  }

  // While a fish is on the line, hand control over to the reeling minigame
  // (fishing_minigame.js) instead of moving the player around.
  if (this.fishingMinigame) {
    this.player.body.setVelocity(0, 0);
    updateFishingMinigame(this, delta);
    return;
  }

  // Start each frame assuming the player isn't moving, then turn on
  // whichever direction's key is currently held down. We also remember the
  // last direction pressed as this.facing, so we know which way the
  // player is "looking" even while standing still.
  this.player.body.setVelocity(0, 0);

  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-PLAYER_SPEED);
    this.facing = 'left';
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(PLAYER_SPEED);
    this.facing = 'right';
  }

  if (this.cursors.up.isDown) {
    this.player.body.setVelocityY(-PLAYER_SPEED);
    this.facing = 'up';
  } else if (this.cursors.down.isDown) {
    this.player.body.setVelocityY(PLAYER_SPEED);
    this.facing = 'down';
  }

  // Figure out which tile the player is standing on, and which tile is
  // directly in front of them based on this.facing.
  const playerCol = Math.floor(this.player.x / TILE_SIZE);
  const playerRow = Math.floor(this.player.y / TILE_SIZE);

  let targetCol = playerCol;
  let targetRow = playerRow;
  if (this.facing === 'left') targetCol -= 1;
  else if (this.facing === 'right') targetCol += 1;
  else if (this.facing === 'up') targetRow -= 1;
  else if (this.facing === 'down') targetRow += 1;

  // Check that the tile in front is actually inside the map, then check
  // whether it's a water tile (tile type 2 - see map.js).
  const inBounds = targetRow >= 0 && targetRow < MAP_HEIGHT && targetCol >= 0 && targetCol < MAP_WIDTH;
  const facingWater = inBounds && MAP_GRID[targetRow][targetCol] === 2;

  this.fishPrompt.setVisible(facingWater);

  // JustDown is true for exactly one frame - the moment SPACE is first
  // pressed - so holding the key down doesn't start multiple minigames.
  if (facingWater && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
    startFishingMinigame(this); // defined in fishing_minigame.js
  }
}

// This line actually creates the game using the settings above.
const game = new Phaser.Game(config);
