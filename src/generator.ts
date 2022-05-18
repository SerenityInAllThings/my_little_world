import World, { createEmptyWorld } from "./domain/world";
import SimplexNoise from "simplex-noise";
import Tile, { rockTile } from "./domain/tile";
import { render2DNumbers } from "./visualizer2D";

interface GenerateWorldParams {
  height: number;
  width: number;
  depth: number;
  seed?: number;
}

export const generateWorld = ({
  height,
  width,
  depth,
}: GenerateWorldParams): World => {
  const world = createEmptyWorld(height, width, depth);
  const rockBottomMap = generateRockBottomHeightMap({ height, width, depth });
  render2DNumbers(rockBottomMap, "rockBottomMap");
  mergeNoiseMapWithWorld(world, rockBottomMap, rockTile);
  return world;
};

const getRockBottomMaxHeight = (worldHeight: number) =>
  Math.ceil(worldHeight / 5);

const mergeNoiseMapWithWorld = (
  world: World,
  noise: number[][],
  tile: Tile,
  baseHeight: number = 0
) => {
  noise.forEach((noiseWidth, width) => {
    noiseWidth.forEach((noiseValue, depth) => {
      const maxHeight = Math.floor(noiseValue);
      for (let height = baseHeight; height <= maxHeight; height++) {
        world.map[height][width][depth] = tile;
      }
    });
  });
};

const generateRockBottomHeightMap = ({
  height,
  width,
  depth,
  seed,
}: GenerateWorldParams) => {
  const amplitude = getRockBottomMaxHeight(height);
  return generate2DNoise(width, depth, amplitude, seed, 0.015, [
    { amplitude: amplitude / 2, frequency: 0.3 },
    { amplitude: amplitude / 4, frequency: 0.6 },
    { amplitude: amplitude / 8, frequency: 1.2 },
  ]);
};

interface Octave {
  amplitude: number;
  frequency: number;
}

const generate2DNoise = (
  width: number,
  height: number,
  amplitude: number = 64,
  seed?: number,
  frequency: number = 1,
  octaves?: Octave[]
) => {
  const map: number[][] = [];
  const getNoise = get2DNoiseFactory(seed);
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      if (!map[w]) map[w] = [];
      let noise = getNoise(frequency * w, frequency * h) * amplitude;

      octaves?.forEach((octave) => {
        noise +=
          octave.amplitude *
          getNoise(octave.frequency * w, octave.frequency * h);
      });
      map[w][h] = noise;
    }
  }
  return map;
};

const get2DNoiseFactory = (seed: number = 1337) => {
  const simplexes: { [seed: number]: SimplexNoise } = {};
  const getSimplex = (seed: number) => {
    if (!simplexes[seed]) simplexes[seed] = new SimplexNoise(seed);
    return simplexes[seed];
  };
  return (x: number, y: number) => (getSimplex(seed).noise2D(x, y) + 1) / 2;
};

export { generate2DNoise };
