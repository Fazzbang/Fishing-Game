// map.js
// This file describes our 20x15 tile map using plain numbers.
// Each number means a type of ground tile:
//   0 = grass
//   1 = path (dirt)
//   2 = water
//   3 = sand (the beach strip along the water's edge)
//   4 = flowers (a decorative patch on the grass)
//   5 = fence (a boundary line, e.g. the edge of the shack's yard)
//
// These numbers double as frame indexes into our tileset image
// (assets/tileset.png), which has one 16x16 pixel-art tile per number, in
// the same order as the list above.

const TILE_SIZE = 32; // each tile is drawn at 32x32 pixels on screen (the
                       // source art is 16x16 - Phaser scales it up 2x so it
                       // stays nice and chunky/readable)

// The map is written row by row, top to bottom - reading this grid is a
// bit like looking straight down at the map from above.
const MAP_GRID = [
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

const MAP_HEIGHT = MAP_GRID.length;   // number of rows (15)
const MAP_WIDTH = MAP_GRID[0].length; // number of columns (20)
