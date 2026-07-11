// map.js
// This file describes our tiny 15x10 tile map using plain numbers.
// Each number means a type of ground tile:
//   0 = grass
//   1 = path (dirt)
//   2 = water
//
// Later we'll swap these numbers for real pixel art images. For now, each
// number just becomes a colored square when we draw it.

const TILE_SIZE = 32; // each tile is a 32x32 pixel square on screen

// The map is written row by row, top to bottom - reading this grid is a
// bit like looking straight down at the map from above.
const MAP_GRID = [
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

const MAP_HEIGHT = MAP_GRID.length;   // number of rows (10)
const MAP_WIDTH = MAP_GRID[0].length; // number of columns (15)

// Which color to draw for each tile number above.
const TILE_COLORS = {
  0: 0x3fa34d, // grass - green
  1: 0x8b5a2b, // path - brown
  2: 0x3a7ca5  // water - blue
};
