import { input as rawInput } from "./input";
import { buildWireDetector, putSureNumberFirstSort } from "./digitalWires";

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
  const input = rawInput
    .split("\n")
    .map((line) => line.split(" | ").map((part) => part.split(" ")));

  let part2 = 0;

  for (const [examples, outputs] of input) {
    let wireDetector = buildWireDetector();

    const allEntries = [...examples, ...outputs].sort(putSureNumberFirstSort);

    // detection phase
    for (const entry of allEntries) {
      const sequence = entry.split("");

      if (wireDetector.is1(sequence)) {
        wireDetector.restrictPossibilitiesFor1(sequence);
      }

      if (wireDetector.is7(sequence)) {
        wireDetector.restrictPossibilitiesFor7(sequence);
      }

      if (wireDetector.is4(sequence)) {
        wireDetector.restrictPossibilitiesFor4(sequence);
      }

      // as we sorted by length, we can know try number 3:
      // only one from length 5 that have both segments C and F
      if (wireDetector.is3(sequence)) {
        wireDetector.restrictPossibilitiesFor3(sequence);
      }

      // now, let's use number 6:
      // only one from length 6 that has distinction between C and F
      if (wireDetector.is6(sequence)) {
        wireDetector.restrictPossibilitiesFor6(sequence);
      }
    }

    if (!wireDetector.isWireDetectionComplete()) {
      throw new Error("Expecting auto guess to work without much trouble");
    }

    const fullNumber = outputs
      .map((output) => {
        return wireDetector.getNumberFromSequence(output.split("")).toString();
      })
      .join("");

    part2 += Number(fullNumber);
  }

  return part2;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
