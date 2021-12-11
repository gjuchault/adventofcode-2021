import {
  actionMap,
  characterMap,
  closeCharacter,
  getInitialDepthManager,
  openCharacter,
} from "./depthMap";
import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput.split("\n");

  let part1 = 0;

  for (const line of input) {
    let depthManager = getInitialDepthManager();

    for (const [i, character] of line.split("").entries()) {
      const isLast = i === line.length - 1;
      const characterType = characterMap[character];
      const action = actionMap[character];

      if (action === "open") {
        depthManager = openCharacter(depthManager, characterType, isLast);
      } else if (action === "close") {
        depthManager = closeCharacter(depthManager, characterType, isLast);
      }

      if (depthManager.result === "incomplete") {
        break;
      }

      if (depthManager.result === "invalid") {
        part1 += depthManager.score;
        break;
      }
    }
  }

  return part1;
}

async function part2() {
  const input = rawInput.split("\n");

  const scores: number[] = [];

  for (const line of input) {
    let depthManager = getInitialDepthManager();

    for (const [i, character] of line.split("").entries()) {
      const isLast = i === line.length - 1;
      const characterType = characterMap[character];
      const action = actionMap[character];

      if (action === "open") {
        depthManager = openCharacter(depthManager, characterType, isLast);
      } else if (action === "close") {
        depthManager = closeCharacter(depthManager, characterType, isLast);
      }

      if (depthManager.result === "incomplete") {
        scores.push(depthManager.score);
        break;
      }

      if (depthManager.result === "invalid") {
        break;
      }
    }
  }

  return scores.sort((a, b) => a - b).at(Math.floor(scores.length / 2));
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
