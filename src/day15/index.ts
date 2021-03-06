import { createGrid } from "../helpers/grid";
import { computeRisk } from "./chiton";
import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput.split("\n").map((row) => row.split("").map(Number));

  const grid = createGrid<number>();
  grid.fromArray(input);

  return computeRisk(grid);
}

async function part2() {
  const input = rawInput.split("\n").map((row) => row.split("").map(Number));

  const initialGrid = createGrid<number>();
  initialGrid.fromArray(input);

  const extendedGrid = createGrid<number>();

  for (let x = 0; x < (initialGrid.maxX + 1) * 5; x++) {
    for (let y = 0; y < (initialGrid.maxY + 1) * 5; y++) {
      const increase =
        Math.floor(x / (initialGrid.maxX + 1)) +
        Math.floor(y / (initialGrid.maxY + 1));

      const originalX = x % (initialGrid.maxX + 1);
      const originalY = y % (initialGrid.maxY + 1);
      const originalValue = initialGrid.at(originalX, originalY)!;

      let newValue = originalValue + increase;

      if (newValue > 9) {
        newValue -= 9;
      }

      extendedGrid.set(x, y, newValue);
    }
  }

  return computeRisk(extendedGrid);
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
