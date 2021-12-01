import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput.split("\n").map(Number);
  let part1 = 0;

  for (let i = 1; i < input.length; i++) {
    if (input[i - 1] < input[i]) {
      part1 += 1;
    }
  }

  return part1;
}

async function part2() {
  const input = rawInput.split("\n").map(Number);
  let part2 = 0;

  let previousWindow = Infinity;

  for (let i = 0; i < input.length - 2; i++) {
    const firstItem = input[i];
    const secondItem = input[i + 1];
    const thirdItem = input[i + 2];
    const currentWindow = firstItem + secondItem + thirdItem;

    if (previousWindow < currentWindow) {
      part2 += 1;
    }

    previousWindow = currentWindow;
  }

  return part2;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
