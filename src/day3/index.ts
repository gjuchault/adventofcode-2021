import { transpose } from "../helpers/array";
import { input as rawInput } from "./input";

async function part1() {
  const diagnostic = rawInput
    .split("\n")
    .map((line) => line.split("").map((n) => Number(n)));

  const transposed = transpose(diagnostic);

  const gammaArray = transposed.map((row) =>
    row.filter((item) => item === 1).length > row.length / 2 ? 1 : 0
  );
  const gamma = parseInt(gammaArray.join(""), 2);

  const epsilon = parseInt(
    gammaArray.map((item) => (item === 1 ? 0 : 1)).join(""),
    2
  );

  return gamma * epsilon;
}

async function part2() {}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
