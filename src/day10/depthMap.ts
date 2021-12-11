export type ProgramCharacter = "parenthesis" | "bracket" | "curly" | "lessThan";

export type DepthManager = {
  closeTail: ProgramCharacter[];
  result: "complete" | "incomplete" | "invalid";
  score: number;
};

export function getInitialDepthManager(): DepthManager {
  return {
    closeTail: [],
    result: "complete",
    score: 0,
  };
}

export const characterMap: Record<string, ProgramCharacter> = {
  "(": "parenthesis",
  ")": "parenthesis",
  "[": "bracket",
  "]": "bracket",
  "{": "curly",
  "}": "curly",
  "<": "lessThan",
  ">": "lessThan",
};

export const actionMap: Record<string, "open" | "close"> = {
  "(": "open",
  ")": "close",
  "[": "open",
  "]": "close",
  "{": "open",
  "}": "close",
  "<": "open",
  ">": "close",
};

export const incorrectScoreMap: Record<ProgramCharacter, number> = {
  parenthesis: 3,
  bracket: 57,
  curly: 1197,
  lessThan: 25137,
};

export const incompleteScoreMap: Record<ProgramCharacter, number> = {
  parenthesis: 1,
  bracket: 2,
  curly: 3,
  lessThan: 4,
};

export function openCharacter(
  depthManager: DepthManager,
  character: ProgramCharacter,
  isLast: boolean
): DepthManager {
  const result = {
    closeTail: [...depthManager.closeTail, character],
    result: depthManager.result,
    score: depthManager.score,
  };

  if (isLast) {
    return {
      closeTail: result.closeTail,
      result: "incomplete",
      // using reverse because closeTail is LIFO
      score: calculateIncompleteScore(result.closeTail.reverse()),
    };
  }

  return result;
}

export function closeCharacter(
  depthManager: DepthManager,
  character: ProgramCharacter,
  isLast: boolean
): DepthManager {
  if (depthManager.closeTail.at(-1) !== character) {
    return {
      closeTail: depthManager.closeTail,
      result: "invalid",
      score: incorrectScoreMap[character],
    };
  }

  const result = {
    closeTail: depthManager.closeTail.slice(0, -1),
    result: depthManager.result,
    score: depthManager.score,
  };

  if (isLast && result.closeTail.length > 0) {
    return {
      closeTail: result.closeTail,
      result: "incomplete",
      // using reverse because closeTail is LIFO
      score: calculateIncompleteScore(result.closeTail.reverse()),
    };
  }

  return result;
}

function calculateIncompleteScore(
  missingCharacters: ProgramCharacter[]
): number {
  return missingCharacters.reduce((acc, character) => {
    return acc * 5 + incompleteScoreMap[character];
  }, 0);
}
