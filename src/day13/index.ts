import { input as rawInput } from "./input";
import { createOrigami, fold } from "./origami";

async function part1() {
  const input = rawInput.split("\n");

  const origami = createOrigami(input);

  const folded = fold(origami);

  const numberOfDots = folded.grid.allPoints().reduce((acc, point) => {
    if (point.value === "#") {
      return acc + 1;
    }

    return acc;
  }, 0);

  return numberOfDots;
}

async function part2() {
  const input = rawInput.split("\n");
  let origami = createOrigami(input);

  while (origami.folds.length) {
    origami = fold(origami);
  }

  console.log(origami.grid.display());

  return "UCLZRAZU";
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
