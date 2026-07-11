// fishing_minigame.js
// The "reeling" minigame that runs when the player tries to catch a fish.
// A marker slides back and forth along a bar; the player must press SPACE
// while it's inside the highlighted "zone" enough times before running out
// of tries. Different fish (see fish.js) have different zone sizes, marker
// speeds, and hit requirements, so some species are much harder to land.

const MINIGAME_TRACK_WIDTH = 300;
const MINIGAME_TRACK_HEIGHT = 24;

// Creates (but hides) all the visual pieces of the minigame. Call this once
// from create().
function createFishingMinigameUI(scene) {
  const cx = config.width / 2;
  const cy = config.height / 2;

  // The dark background bar the marker slides across.
  scene.mgTrack = scene.add.rectangle(cx, cy, MINIGAME_TRACK_WIDTH, MINIGAME_TRACK_HEIGHT, 0x222222).setVisible(false);
  // The green "catch zone" - its width changes per fish, set in startFishingMinigame().
  scene.mgZone = scene.add.rectangle(cx, cy, MINIGAME_TRACK_WIDTH, MINIGAME_TRACK_HEIGHT, 0x4caf50, 0.85).setVisible(false);
  // The white marker that slides back and forth.
  scene.mgMarker = scene.add.rectangle(cx, cy, 6, MINIGAME_TRACK_HEIGHT + 10, 0xffffff).setVisible(false);

  scene.mgInstructions = scene.add.text(cx, cy - MINIGAME_TRACK_HEIGHT / 2 - 24, '', {
    fontSize: '14px',
    color: '#ffffff',
    backgroundColor: '#000000'
  }).setOrigin(0.5, 1).setVisible(false);

  scene.mgProgressText = scene.add.text(cx, cy + MINIGAME_TRACK_HEIGHT / 2 + 8, '', {
    fontSize: '14px',
    color: '#ffffff'
  }).setOrigin(0.5, 0).setVisible(false);

  scene.fishingMinigame = null; // null means no minigame is currently running
}

// Starts a new minigame attempt: picks a random fish and sets up all the
// minigame state (marker position, how many hits are needed, etc).
function startFishingMinigame(scene) {
  const fish = pickRandomFish(); // defined in fish.js
  const cx = config.width / 2;
  const zoneWidth = MINIGAME_TRACK_WIDTH * fish.zoneFraction;
  const trackLeft = cx - MINIGAME_TRACK_WIDTH / 2;
  const trackRight = cx + MINIGAME_TRACK_WIDTH / 2;

  scene.fishingMinigame = {
    fish: fish,
    trackLeft: trackLeft,
    trackRight: trackRight,
    zoneLeft: cx - zoneWidth / 2,
    zoneRight: cx + zoneWidth / 2,
    markerX: trackLeft,
    direction: 1, // 1 = moving right, -1 = moving left
    hits: 0,
    attemptsLeft: fish.attempts
  };

  scene.mgZone.setSize(zoneWidth, MINIGAME_TRACK_HEIGHT);
  scene.mgMarker.x = trackLeft;

  scene.fishPrompt.setVisible(false);
  scene.mgTrack.setVisible(true);
  scene.mgZone.setVisible(true);
  scene.mgMarker.setVisible(true);
  scene.mgInstructions.setText('Something\'s biting! Press SPACE when the marker is in the green zone.').setVisible(true);
  refreshMinigameProgressText(scene);
}

function refreshMinigameProgressText(scene) {
  const mg = scene.fishingMinigame;
  scene.mgProgressText.setText(
    'Hits: ' + mg.hits + '/' + mg.fish.hitsNeeded + '   Tries left: ' + mg.attemptsLeft
  );
}

// Runs every frame while a minigame is active: slides the marker back and
// forth, and checks for a SPACE press to register a hit or a miss.
function updateFishingMinigame(scene, delta) {
  const mg = scene.fishingMinigame;

  // Move the marker, reversing direction whenever it reaches either end.
  const distance = mg.fish.speed * (delta / 1000);
  mg.markerX += mg.direction * distance;
  if (mg.markerX <= mg.trackLeft) {
    mg.markerX = mg.trackLeft;
    mg.direction = 1;
  } else if (mg.markerX >= mg.trackRight) {
    mg.markerX = mg.trackRight;
    mg.direction = -1;
  }
  scene.mgMarker.x = mg.markerX;

  if (Phaser.Input.Keyboard.JustDown(scene.spaceKey)) {
    mg.attemptsLeft -= 1;
    const isHit = mg.markerX >= mg.zoneLeft && mg.markerX <= mg.zoneRight;
    if (isHit) {
      mg.hits += 1;
    }
    refreshMinigameProgressText(scene);

    if (mg.hits >= mg.fish.hitsNeeded) {
      endFishingMinigame(scene, true);
    } else if (mg.attemptsLeft <= 0) {
      endFishingMinigame(scene, false);
    }
  }
}

// Ends the current minigame, either landing the fish (success) or letting
// it get away, and shows the matching popup message.
function endFishingMinigame(scene, success) {
  const fishName = scene.fishingMinigame.fish.name;
  scene.fishingMinigame = null;

  scene.mgTrack.setVisible(false);
  scene.mgZone.setVisible(false);
  scene.mgMarker.setVisible(false);
  scene.mgInstructions.setVisible(false);
  scene.mgProgressText.setVisible(false);

  if (success) {
    scene.caughtFish.push(fishName);
    scene.catchText.setText('You caught a ' + fishName + '!');
  } else {
    scene.catchText.setText('The ' + fishName + ' got away...');
  }
  scene.catchBox.setVisible(true);
  scene.catchText.setVisible(true);
  scene.time.delayedCall(2000, () => {
    scene.catchBox.setVisible(false);
    scene.catchText.setVisible(false);
  });
}
