import { transpose } from "../helpers/array";
import { input as rawInput } from "./input";

async function part1() {
  const diagnostic = rawInput
    .split("\n")
    .map((line) => line.split("").map((n) => Number(n)));

  const transposedDiagnostic = transpose(diagnostic);

  const gammaArray = transposedDiagnostic.map((row) =>
    row.filter((item) => item === 1).length >= row.length / 2 ? 1 : 0
  );
  const gamma = parseInt(gammaArray.join(""), 2);

  const epsilon = parseInt(
    gammaArray.map((item) => (item === 1 ? 0 : 1)).join(""),
    2
  );

  return gamma * epsilon;
}

async function part2() {
  const diagnostic = rawInput
    .split("\n")
    .map((line) => line.split("").map((n) => Number(n)));

  const oxygenGeneratorRating = filterDiagnostic(diagnostic, (row) => {
    const mostCommonBit =
      row.filter((item) => item === 1).length >= row.length / 2 ? 1 : 0;

    return (item) => item === mostCommonBit;
  });

  const co2ScrubberRating = filterDiagnostic(diagnostic, (row) => {
    const leastCommonBit =
      row.filter((item) => item === 1).length >= row.length / 2 ? 0 : 1;

    return (item) => item === leastCommonBit;
  });

  return oxygenGeneratorRating * co2ScrubberRating;
}

function filterDiagnostic(
  diagnostic: number[][],
  createTakeBit: (row: number[]) => (item: number) => boolean
) {
  let transposedDiagnostic = transpose(diagnostic);

  let column = 0;
  while (true) {
    const row = transposedDiagnostic[column];
    const takeBit = createTakeBit(row);

    let indexesToRemove: number[] = [];

    for (let i = 0; i < row.length; i++) {
      if (!takeBit(row[i])) {
        indexesToRemove.push(i);
      }
    }

    const nextTransposedDiagnostic = transposedDiagnostic.map((row) =>
      row.filter((_, index) => !indexesToRemove.includes(index))
    );

    transposedDiagnostic = nextTransposedDiagnostic;

    if (transposedDiagnostic[0].length === 1) {
      break;
    }

    column += 1;
  }

  return parseInt(transposedDiagnostic.map((item) => item[0]).join(""), 2);
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
