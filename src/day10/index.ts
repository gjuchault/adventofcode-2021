import { input as rawInput } from "./input";

type ProgramCharacter = "parenthesis" | "bracket" | "curly" | "lessThan";

type DepthManager = {
  map: {
    parenthesis: number;
    bracket: number;
    curly: number;
    lessThan: number;
  };
  closeTail: ProgramCharacter[];
  result: "complete" | "incomplete" | "invalid";
  score: number;
};

const characterMap: Record<string, ProgramCharacter> = {
  "(": "parenthesis",
  ")": "parenthesis",
  "[": "bracket",
  "]": "bracket",
  "{": "curly",
  "}": "curly",
  "<": "lessThan",
  ">": "lessThan",
};

const actionMap: Record<string, "open" | "close"> = {
  "(": "open",
  ")": "close",
  "[": "open",
  "]": "close",
  "{": "open",
  "}": "close",
  "<": "open",
  ">": "close",
};

const scoreMap: Record<ProgramCharacter, number> = {
  parenthesis: 3,
  bracket: 57,
  curly: 1197,
  lessThan: 25137,
};

async function part1() {
  const input = rawInput.split("\n");

  let part1 = 0;

  for (const line of input) {
    let depthManager: DepthManager = {
      map: {
        parenthesis: 0,
        bracket: 0,
        curly: 0,
        lessThan: 0,
      },
      closeTail: [],
      result: "complete",
      score: 0,
    };

    for (const character of line) {
      const characterType = characterMap[character];
      const action = actionMap[character];

      if (action === "open") {
        depthManager = openCharacter(depthManager, characterType);
      } else if (action === "close") {
        depthManager = closeCharacter(depthManager, characterType);
      }

      if (depthManager.result === "incomplete") {
        break;
      }

      if (depthManager.result === "invalid") {
        part1 += scoreMap[characterType];
        break;
      }
    }
  }

  return part1;
}

function openCharacter(
  depthManager: DepthManager,
  character: ProgramCharacter
): DepthManager {
  return {
    map: {
      ...depthManager.map,
      [character]: depthManager.map[character] + 1,
    },
    closeTail: [...depthManager.closeTail, character],
    result: depthManager.result,
    score: depthManager.score,
  };
}

function closeCharacter(
  depthManager: DepthManager,
  character: ProgramCharacter
): DepthManager {
  if (depthManager.closeTail.at(-1) !== character) {
    return {
      map: depthManager.map,
      closeTail: depthManager.closeTail,
      result: "invalid",
      score: scoreMap[character],
    };
  }

  return {
    map: {
      ...depthManager.map,
      [character]: depthManager.map[character] - 1,
    },
    closeTail: depthManager.closeTail.slice(0, -1),
    result: depthManager.result,
    score: depthManager.score,
  };
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
