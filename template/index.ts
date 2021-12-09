import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput.split("\n").map(Number);

  return input.length;
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
