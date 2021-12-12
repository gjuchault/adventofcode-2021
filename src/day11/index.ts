import { createGrid, Point } from "../helpers/grid";
import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput.split("\n").map((line) => line.split("").map(Number));

  const grid = createGrid<number>();
  grid.fromArray(input);

  const steps = 100;

  let numberOfFlashes = 0;

  for (let i = 0; i < steps; i++) {
    let pointsFlashed: Set<string> = new Set();

    function flashPoint(point: Point<number>) {
      if (pointsFlashed.has(`${point.x},${point.y}`)) {
        return;
      }

      numberOfFlashes += 1;
      pointsFlashed.add(`${point.x},${point.y}`);

      for (const adjacent of grid.adjacents(point.x, point.y, true)) {
        // we have to go through a function call since adjacent might clash with
        // other flashes. Think about setState in react
        grid.setFn(adjacent.x, adjacent.y, (v) => {
          if (v === 9) {
            flashPoint(adjacent);
            return 0;
          }

          return v + 1;
        });
      }
    }

    // step 1: the energy level of each octopus increases by 1
    for (let x = 0; x < grid.width(); x++) {
      for (let y = 0; y < grid.height(); y++) {
        const energyLevel = grid.at(x, y)!;

        grid.set(x, y, energyLevel + 1);
      }
    }

    // step 2: flash
    for (let x = 0; x < grid.width(); x++) {
      for (let y = 0; y < grid.height(); y++) {
        const energyLevel = grid.at(x, y)!;

        if (energyLevel > 9) {
          flashPoint({ x, y, value: energyLevel });
        }
      }
    }

    // step 3: reset flashed octopus
    for (const point of pointsFlashed) {
      const [x, y] = point.split(",").map(Number);

      grid.set(x, y, 0);
    }
  }

  return numberOfFlashes;
}

async function part2() {
  const input = rawInput.split("\n").map((line) => line.split("").map(Number));

  return input.length;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
