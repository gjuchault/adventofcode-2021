import { input as rawInput } from "./input";
import { createGrid } from "../helpers/grid";

async function part1() {
  const input = rawInput.split("\n").map((line) => line.split("").map(Number));

  let part1 = 0;

  const grid = createGrid<number>();
  grid.fromArray(input);

  for (let x = 0; x < grid.width(); x++) {
    for (let y = 0; y < grid.height(); y++) {
      const cell = grid.at(x, y);

      if (cell === undefined) {
        throw new Error("Cell is undefined");
      }

      const adjacents = grid.adjacents(x, y);

      const isLowPoint = adjacents.every((adjacent) => adjacent > cell);

      if (isLowPoint) {
        part1 += cell + 1;
      }
    }
  }

  return part1;
}

async function part2() {
  const input = rawInput.split("\n").map(Number);

  return input.length;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
