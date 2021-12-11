import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput
    .split("\n")
    .map((line) => line.split(" | ").map((part) => part.split(" ")));

  const numberByLength = new Map([
    [2, 1],
    [4, 4],
    [3, 7],
    [7, 8],
  ]);

  return input
    .flatMap(([examples, output]) => {
      return output.filter((sequence) => numberByLength.has(sequence.length))
        .length;
    })
    .reduce((acc, curr) => acc + curr, 0);
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
