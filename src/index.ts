import { getViewFromAbove } from "./domain/world";
import { generateWorld } from "./generator";
import { render2DTiles } from "./visualizer2D";
import { saveToDisk } from "./visualizerIsometric";

const world = generateWorld({ height: 20, depth: 50, width: 50 });
render2DTiles(getViewFromAbove(world));
saveToDisk(world);
