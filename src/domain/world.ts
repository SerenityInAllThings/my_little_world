import Tile, { EmptyTile, emptyTile } from "./tile";

export default interface World {
  map: Tile[][][];
}

//** This is also the maximum H property in the map */
const getHeight = (world: World) => world.map.length - 1;
//** This is also the maximum W property in the map */
export const getWidth = (world: World) => world.map[0].length - 1;
//** This is also the maximum D property in the map */
export const getDepth = (world: World) => world.map[0][0].length - 1;
//** Will return an array of tiles that represents all tiles in w,d coordinates */
export const getTileColumn = (world: World, w: number, d: number): Tile[] => {
  if (w < 0 || w > getWidth(world))
    throw new Error(`W coodinate ${w} is out of range.`);
  if (d < 0 || d > getDepth(world))
    throw new Error(`D coodinate ${d} is out of range.`);

  return world.map.map((mapSlice) => mapSlice[w][d]);
};

export const createEmptyWorld = (
  height: number,
  width: number,
  depth: number
): World => {
  const map: Tile[][][] = [];
  for (let h = 0; h < height; h++) {
    if (!map[h]) map[h] = [];
    for (let w = 0; w < width; w++) {
      if (!map[h][w]) map[h][w] = [];
      for (let d = 0; d < depth; d++) {
        map[h][w][d] = { ...emptyTile };
      }
    }
  }
  return { map };
};

/** Will return a 2D matrix of tile as if the world as viewed from above. Will ignore empty blocks.*/
export const getViewFromAbove = (world: World): Tile[][] => {
  const maxWidth = getWidth(world);
  const maxDepth = getDepth(world);
  const view: Tile[][] = [];

  for (let w = 0; w <= maxWidth; w++) {
    for (let d = 0; d <= maxDepth; d++) {
      if (!view[w]) view[w] = [];
      const tileColumn = getTileColumn(world, w, d);
      view[w][d] = tileColumn.find((tile) => !tile.isTransparent) ?? emptyTile;
    }
  }
  return view;
};
