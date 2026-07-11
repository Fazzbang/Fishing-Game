// fish.js
// The list of fish the player can catch. This is a placeholder list of 3 -
// later this will grow into a full list of ~150 real Australian species,
// each with real rarity and a proper "Fight rating" tied to rod tiers.
//
// For now each fish just has some made-up difficulty numbers so the
// reeling minigame (see fishing_minigame.js) feels different per species:
//   zoneFraction - how much of the reeling bar counts as a "hit" (smaller = harder)
//   speed        - how fast the marker slides back and forth, in pixels/second (faster = harder)
//   hitsNeeded   - how many successful hits are needed to land the fish
//   attempts     - how many total tries you get before the fish escapes
const FISH_LIST = [
  { name: 'Goldfish',     zoneFraction: 0.35, speed: 130, hitsNeeded: 3, attempts: 5 }, // 2 misses allowed
  { name: 'Common Carp',  zoneFraction: 0.22, speed: 170, hitsNeeded: 3, attempts: 4 }, // 1 miss allowed
  { name: 'Redfin Perch', zoneFraction: 0.14, speed: 210, hitsNeeded: 3, attempts: 3 }  // 0 misses allowed
];

// Picks and returns one random fish (an object from FISH_LIST above) that
// has been hooked and is about to go into the reeling minigame.
function pickRandomFish() {
  const randomIndex = Math.floor(Math.random() * FISH_LIST.length);
  return FISH_LIST[randomIndex];
}
