import { intersection } from "../helpers/array";
import { reverseMap } from "../helpers/map";

export function buildWireDetector() {
  const wires = getInitialPossibilities();

  function filterPossibility(sequence: string[], k: string) {
    const currentPossibilities = wires.get(k)!;

    if (currentPossibilities.length === 1) {
      return;
    }

    wires.set(k, intersection(sequence, currentPossibilities));
  }

  function removePossibility(sequence: string[], k: string) {
    const currentPossibilities = wires.get(k)!;

    if (currentPossibilities.length === 1) {
      return;
    }

    wires.set(
      k,
      currentPossibilities.filter((w) => !sequence.includes(w))
    );
  }

  function restrictPossibilitiesFor1(sequence: string[]) {
    removePossibility(sequence, "a");
    removePossibility(sequence, "b");
    filterPossibility(sequence, "c");
    removePossibility(sequence, "d");
    removePossibility(sequence, "e");
    filterPossibility(sequence, "f");
    removePossibility(sequence, "g");
  }

  function restrictPossibilitiesFor7(sequence: string[]) {
    filterPossibility(sequence, "a");
    removePossibility(sequence, "b");
    filterPossibility(sequence, "c");
    removePossibility(sequence, "d");
    removePossibility(sequence, "e");
    filterPossibility(sequence, "f");
    removePossibility(sequence, "g");
  }

  function restrictPossibilitiesFor4(sequence: string[]) {
    removePossibility(sequence, "a");
    filterPossibility(sequence, "b");
    filterPossibility(sequence, "c");
    filterPossibility(sequence, "d");
    removePossibility(sequence, "e");
    filterPossibility(sequence, "f");
    removePossibility(sequence, "g");
  }

  function restrictPossibilitiesFor3(sequence: string[]) {
    filterPossibility(sequence, "a");
    removePossibility(sequence, "b");
    filterPossibility(sequence, "c");
    filterPossibility(sequence, "d");
    removePossibility(sequence, "e");
    filterPossibility(sequence, "f");
    filterPossibility(sequence, "g");
  }

  function restrictPossibilitiesFor6(sequence: string[]) {
    removePossibility(sequence, "c");
    filterPossibility(sequence, "f");
  }

  function is1(sequence: string[]) {
    return sequence.length === 2;
  }

  function is4(sequence: string[]) {
    return sequence.length === 4;
  }

  function is7(sequence: string[]) {
    return sequence.length === 3;
  }

  function is3(sequence: string[]) {
    const possibilitiesForC = wires.get("c");
    const possibilitiesForF = wires.get("f");

    if (possibilitiesForC?.length !== 2 || possibilitiesForF?.length !== 2) {
      return false;
    }

    return (
      sequence.length === 5 &&
      [...possibilitiesForC, ...possibilitiesForF].every((possibilityForCF) =>
        sequence.includes(possibilityForCF)
      )
    );
  }

  function is6(sequence: string[]) {
    const possibilitiesForD = wires.get("d");
    const possibilitiesForE = wires.get("e");

    if (possibilitiesForD?.length !== 1 || possibilitiesForE?.length !== 1) {
      return false;
    }

    return (
      sequence.length === 6 &&
      // not 0
      sequence.includes(possibilitiesForD[0]) &&
      // not 9
      sequence.includes(possibilitiesForE[0])
    );
  }

  function isWireDetectionComplete() {
    return [...wires.values()].sort().join("") === "abcdefg";
  }

  function getNumberFromSequence(sequence: string[]) {
    if (!isWireDetectionComplete()) {
      throw new Error("Can not get number from sequence at this stage");
    }

    const realWireByRandomWire = reverseMap(wires, ([letter]) => letter);

    const realSeq = sequence
      .map((letter) => realWireByRandomWire.get(letter))
      .sort()
      .join("");

    const realNumber = numberByWires.get(realSeq);

    if (realNumber === undefined) {
      throw new Error("Unknown sequence");
    }

    return realNumber;
  }

  return {
    wires,
    restrictPossibilitiesFor1,
    restrictPossibilitiesFor7,
    restrictPossibilitiesFor4,
    restrictPossibilitiesFor3,
    restrictPossibilitiesFor6,
    is1,
    is7,
    is4,
    is3,
    is6,
    isWireDetectionComplete,
    getNumberFromSequence,
  };
}

export function putSureNumberFirstSort(left: string, right: string) {
  return left.length - right.length;
}

const numberByWires = new Map([
  ["abcefg", 0],
  ["cf", 1],
  ["acdeg", 2],
  ["acdfg", 3],
  ["bcdf", 4],
  ["abdfg", 5],
  ["abdefg", 6],
  ["acf", 7],
  ["abcdefg", 8],
  ["abcdfg", 9],
]);

function getInitialPossibilities() {
  return new Map<string, string[]>([
    ["a", ["a", "b", "c", "d", "e", "f", "g"]],
    ["b", ["a", "b", "c", "d", "e", "f", "g"]],
    ["c", ["a", "b", "c", "d", "e", "f", "g"]],
    ["d", ["a", "b", "c", "d", "e", "f", "g"]],
    ["e", ["a", "b", "c", "d", "e", "f", "g"]],
    ["f", ["a", "b", "c", "d", "e", "f", "g"]],
    ["g", ["a", "b", "c", "d", "e", "f", "g"]],
  ]);
}
