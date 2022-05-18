import { createCanvas, JPEGStream } from "canvas";
import fs, { WriteStream } from "fs";
import path from "path";
import Tile from "./domain/tile";

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

const black: RGBA = { r: 0, g: 0, b: 0, a: 255 };

interface Coodinate2D {
  x: number;
  y: number;
}

const getBiggest = (numbers: number[]) => Math.max(...numbers);
const getBiggest2D = (numbers: number[][]) =>
  getBiggest(numbers.map(getBiggest));

const getLowest = (numbers: number[]) => Math.min(...numbers);
const getLowest2D = (numbers: number[][]) => getLowest(numbers.map(getLowest));

const areAllLinesSameLength = (matrix: any[][]) =>
  matrix.every(({ length }) => matrix?.[0].length === length);

export const saveImage = (
  canvasStream: JPEGStream,
  fileStream: WriteStream
) => {
  return new Promise((resolve, reject) => {
    canvasStream.pipe(fileStream);
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });
};

export const getBlankCanvas = (width: number, height: number) => {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  return { canvas, context };
};

const getPixelFactory = (context: CanvasRenderingContext2D) => {
  let pixel: ImageData;
  return () => {
    if (!pixel) pixel = context.createImageData(1, 1);
    return pixel;
  };
};

const colorPixelInCanvas = (
  context: CanvasRenderingContext2D,
  { r, g, b, a }: RGBA,
  { x, y }: Coodinate2D
) => {
  const getPixel = getPixelFactory(context);
  const pixel = getPixel();
  pixel.data[0] = r;
  pixel.data[1] = g;
  pixel.data[2] = b;
  pixel.data[3] = a;
  context.putImageData(pixel, x, y);
};

const getGrayScale = (min: number, max: number, current: number) => {
  const baseDiff = max - min;
  const diff = current - min;
  const ratio = 1 / (baseDiff / diff);
  return Math.round(ratio * 255);
};

export const render2DTiles = async (tiles: Tile[][], title?: string) => {
  if (tiles?.[0]?.[0] == null) throw new Error("Cannot render empty tiles");

  if (!areAllLinesSameLength(tiles))
    throw new Error("All lines need to have the same size");

  const { canvas, context } = getBlankCanvas(tiles.length, tiles[0].length);

  tiles.forEach((tileRow, x) => {
    tileRow.forEach((tile, y) => {
      const color = tile.mainColor ?? black;
      const coordinates = { x, y };
      colorPixelInCanvas(context, color, coordinates);
    });
  });

  const fileName = title
    ? `${title}_tiles.jpg`
    : `$tiles_${new Date().toISOString()}.jpg`;
  const fileStream = fs.createWriteStream(path.join(__dirname, fileName));
  const stream = canvas.createJPEGStream();
  await saveImage(stream, fileStream);
};

export const render2DNumbers = async (numbers: number[][], title?: string) => {
  if (numbers?.[0]?.[0] == null) throw new Error("Cannot render empty numbers");

  if (!areAllLinesSameLength(numbers))
    throw new Error("All lines need to have the same size");

  const lowest = getLowest2D(numbers);
  const biggest = getBiggest2D(numbers);
  console.log(`${title} - ${lowest} -> ${biggest}`);

  const width = numbers.length;
  const height = numbers[0].length;
  const { canvas, context } = getBlankCanvas(width, height);

  numbers.forEach((line, lineIndex) => {
    line.forEach((value, valueIndex) => {
      const gray = getGrayScale(lowest, biggest, value);
      const colors: RGBA = { r: gray, g: gray, b: gray, a: 255 };
      const coordinates = { x: lineIndex, y: valueIndex };
      colorPixelInCanvas(context, colors, coordinates);
    });
  });

  const fileName = title
    ? `${title}_numbers.jpg`
    : `$numbers_${new Date().toISOString()}.jpg`;
  const fileStream = fs.createWriteStream(path.join(__dirname, fileName));
  const stream = canvas.createJPEGStream();
  await saveImage(stream, fileStream);
};
