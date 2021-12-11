import { input as rawInput } from "./input";

async function part1() {
  const fishes = rawInput.split(",").map(Number);

  return calculateFishes(fishes, 80);
}

async function part2() {
  const fishes = rawInput.split(",").map(Number);

  return calculateFishes(fishes, 256);
}

function calculateFishes(initialFishes: number[], days: number) {
  let fishByReset = new Map([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
  ]);

  for (const fish of initialFishes) {
    fishByReset.set(fish, (fishByReset.get(fish) ?? 0) + 1);
  }

  for (let i = 0; i < days; i++) {
    fishByReset = new Map([
      [0, fishByReset.get(1) ?? 0],
      [1, fishByReset.get(2) ?? 0],
      [2, fishByReset.get(3) ?? 0],
      [3, fishByReset.get(4) ?? 0],
      [4, fishByReset.get(5) ?? 0],
      [5, fishByReset.get(6) ?? 0],
      [6, (fishByReset.get(7) ?? 0) + (fishByReset.get(0) ?? 0)],
      [7, fishByReset.get(8) ?? 0],
      [8, fishByReset.get(0) ?? 0],
    ]);
  }

  return Array.from(fishByReset.values()).reduce((a, b) => a + b, 0);
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
