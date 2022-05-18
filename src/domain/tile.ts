import { RGBA } from "../visualizer2D";

type TileType = "salt_water" | "rock" | "sand" | "empty";

export default interface Tile {
  type: TileType;
  isTransparent: boolean;
  mainColor?: RGBA; // Currently supports rgba(0, 128, 255, 255) syntax
}

export interface EmptyTile extends Tile {
  type: "empty";
  isTransparent: true;
  mainColor: { r: 255; g: 255; b: 255; a: 250 };
}

export const emptyTile: EmptyTile = {
  type: "empty",
  isTransparent: true,
  mainColor: { r: 255, g: 255, b: 255, a: 250 },
};

export interface RockTile extends Tile {
  type: "rock";
  isTransparent: false;
}

export const rockTile: RockTile = {
  type: "rock",
  isTransparent: false,
  mainColor: { r: 3, g: 4, b: 14, a: 210 },
};
