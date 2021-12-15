import { createGrid, Point } from "../helpers/grid";
import { createPriorityQueue } from "../helpers/priorityQueue";
import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput.split("\n").map((row) => row.split("").map(Number));

  const grid = createGrid<number>();
  grid.fromArray(input);

  // the problem is to find the shortest path in a weighted directed acyclic graph.
  // BFS is not good enough to do that
  // Let's go with Dijkstra's algorithm

  const startPoint = grid.pointAt(0, 0)!;
  const endPoint = grid.pointAt(grid.width() - 1, grid.height() - 1)!;
  const parentGrid = createGrid<Point<number>>();
  const costGrid = createGrid<number>();

  costGrid.set(0, 0, 0);

  const priorityQueue = createPriorityQueue<Point<number>>(
    (point) => costGrid.at(point.x, point.y) ?? Infinity
  );

  priorityQueue.push(startPoint);

  let bestCandidate: Point<number> | undefined = undefined;

  while (priorityQueue.length > 0) {
    bestCandidate = priorityQueue.pop()!;

    const costFromStartToBestCandidate = costGrid.at(
      bestCandidate.x,
      bestCandidate.y
    )!;

    for (const adjacent of grid.adjacents(bestCandidate.x, bestCandidate.y)) {
      const costFromBestCandidateToAdjacent = adjacent.value;
      const costFromStartToAdjacent =
        costFromStartToBestCandidate + costFromBestCandidateToAdjacent;

      const adjacentCost = costGrid.at(adjacent.x, adjacent.y);
      const isFirstVisit = adjacentCost === undefined;

      // either we never visited the cave, either we visited it but we found a
      // better path
      if (isFirstVisit || adjacentCost > costFromStartToAdjacent) {
        costGrid.set(adjacent.x, adjacent.y, costFromStartToAdjacent);
        priorityQueue.push(adjacent);
        parentGrid.set(adjacent.x, adjacent.y, bestCandidate);
      }
    }
  }

  return costGrid.at(endPoint.x, endPoint.y)!;
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
