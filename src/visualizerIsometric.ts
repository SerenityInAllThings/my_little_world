import World, { getTileColumn, getWidth } from "./domain/world";
import { IsometricCanvas } from "@elchininet/isometric/node";
import fs from "fs";
import path from "path";

export const saveToDisk = (world: World) => {
  fs.writeFileSync(
    path.join(__dirname, "world.json"),
    JSON.stringify(world, null, 2),
    { encoding: "utf-8" }
  );
};

export const renderWorld = async (world: World, title?: string) => {
  const canvas = new IsometricCanvas({
    backgroundColor: "#CCC",
    scale: 120,
    width: 800,
    height: 600,
  });
  // Getting all W x H columns at d = 0
  const wXhcolumns = [];
  for (let w = 0; w < getWidth(world); w++) {
    wXhcolumns.push(getTileColumn(world, w, 0));
  }
  // TODO: WIP
  // const cube = getIsometricCube(0, 0, 0);
  // cube.forEach((side) => canvas.addChild(side));
  // // const cube2 = getIsometricCube(1, 0, 0);
  // // cube2.forEach((side) => canvas.addChild(side));

  // console.log(canvas.getSVGCode());
};

// const convertToIsometricCoordinate = (h: number, w: number, d: number) => ({
//   top: h + 1,
//   right: w,
//   left: d,
// });

// const getIsometricCube = (
//   h: number,
//   w: number,
//   d: number
// ): IsometricRectangle[] => {
//   const { top, right, left } = convertToIsometricCoordinate(h, w, d);
//   const commonProps = { height: 1, width: 1 };
//   const topPiece = new IsometricRectangle({
//     ...commonProps,
//     planeView: PlaneView.TOP,
//   });
//   topPiece.top = top;
//   topPiece.left = left;
//   topPiece.right = right;
//   const rightPiece = new IsometricRectangle({
//     ...commonProps,
//     planeView: PlaneView.FRONT,
//   });
//   rightPiece.right = right;
//   rightPiece.left = left;
//   rightPiece.right = right;
//   const leftPiece = new IsometricRectangle({
//     ...commonProps,
//     planeView: PlaneView.SIDE,
//   });
//   leftPiece.left = left;
//   leftPiece.left = left;
//   leftPiece.right = right;

//   return [topPiece, rightPiece, leftPiece];
// };
