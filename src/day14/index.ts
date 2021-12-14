import { input as rawInput } from "./input";
import {
  applyPolymerization,
  computeScore,
  createPolymerization,
} from "./polymerization";

async function part1() {
  const input = rawInput.split("\n");

  let polymerization = createPolymerization(input);

  for (let i = 0; i < 10; i++) {
    polymerization = applyPolymerization(polymerization);
  }

  return computeScore(polymerization);
}

async function part2() {
  const input = rawInput.split("\n");

  let polymerization = createPolymerization(input);

  let d = Date.now();
  for (let i = 0; i < 40; i++) {
    const now = Date.now();
    polymerization = applyPolymerization(polymerization);

    d = now;
  }

  return computeScore(polymerization);
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
