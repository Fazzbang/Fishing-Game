// fish.js
// The list of fish the player can catch. This is a placeholder list of 3 -
// later this will grow into a full list of ~150 real Australian species,
// each with its own rarity and details. Keeping the list in its own file
// means we can expand it later without touching the game logic.

const FISH_LIST = [
  'Common Carp',
  'Redfin Perch',
  'Goldfish'
];

// Picks and returns one random fish name from the list above.
function catchRandomFish() {
  const randomIndex = Math.floor(Math.random() * FISH_LIST.length);
  return FISH_LIST[randomIndex];
}
