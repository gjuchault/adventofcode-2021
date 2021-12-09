import { transpose } from "../helpers/array";
import { input as rawInput } from "./input";

type Board = {
  rows: number[][];
  columns: number[][];
};

async function part1() {
  const bingo = parseInput(rawInput);

  let bestBoard: Board | undefined;
  let bestBoardScore = Infinity;

  for (const board of bingo.boards) {
    const score = solveBingoBoard(board, bingo.numbersSet);

    if (score <= bestBoardScore) {
      bestBoard = board;
      bestBoardScore = score;
    }
  }

  if (!bestBoard) {
    throw new Error("failed");
  }

  const winningSequence = bingo.numbersSet.slice(0, bestBoardScore + 1);

  const sumOfAllUnmarkedNumbers = bestBoard.columns
    .flat()
    .filter((n) => !winningSequence.includes(n))
    .reduce((a, b) => a + b, 0);

  return sumOfAllUnmarkedNumbers * bingo.numbersSet[bestBoardScore];
}

async function part2() {
  const bingo = parseInput(rawInput);

  let bestBoard: Board | undefined;
  let bestBoardScore = -1;

  for (const board of bingo.boards) {
    const score = solveBingoBoard(board, bingo.numbersSet);

    if (score >= bestBoardScore) {
      bestBoard = board;
      bestBoardScore = score;
    }
  }

  if (!bestBoard) {
    throw new Error("failed");
  }

  const winningSequence = bingo.numbersSet.slice(0, bestBoardScore + 1);

  const sumOfAllUnmarkedNumbers = bestBoard.columns
    .flat()
    .filter((n) => !winningSequence.includes(n))
    .reduce((a, b) => a + b, 0);

  return sumOfAllUnmarkedNumbers * bingo.numbersSet[bestBoardScore];
}

function solveBingoBoard(board: Board, numbersSet: number[]): number {
  let score = Infinity;

  for (const row of board.rows) {
    score = Math.min(score, solveBingoLine(row, numbersSet));
  }

  for (const column of board.columns) {
    score = Math.min(score, solveBingoLine(column, numbersSet));
  }

  return score;
}

function solveBingoLine(line: number[], sequence: number[]): number {
  let score = -1;
  const numbersSetCopy = [...sequence];

  for (const number of line) {
    const pos = numbersSetCopy.indexOf(number);

    if (pos === -1) {
      return -1;
    }

    // replace by -1 to avoid reducing length
    numbersSetCopy[pos] = -1;

    score = Math.max(pos, score);
  }

  return score;
}

function parseInput(input: string) {
  const lines = input.split("\n");

  const numbersSet = lines[0].split(",").map(Number);

  let boards = [];
  let currentBoard = [];

  const entries = lines.slice(2);

  for (const entry of entries) {
    if (entry === "") {
      boards.push(createBoard([...currentBoard]));
      currentBoard = [];
      continue;
    }

    currentBoard.push(entry);
  }
  boards.push(createBoard([...currentBoard]));
  currentBoard = [];

  return {
    numbersSet,
    boards,
  };
}

function createBoard(lines: string[]): Board {
  const rows = [];

  for (const line of lines) {
    const numbers = line
      .trim()
      .replaceAll(/\s{2,}/g, " ")
      .split(" ")
      .map(Number);

    rows.push(numbers);
  }

  const columns = transpose(rows);

  return {
    rows,
    columns,
  };
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
