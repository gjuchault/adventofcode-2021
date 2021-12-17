import { createGrid, Grid, Point } from "../helpers/grid";
import { createPriorityQueue } from "../helpers/priorityQueue";

export function computeRisk(grid: Grid<number>): number {
  // the problem is to find the shortest path in a weighted directed acyclic graph.
  // BFS is not good enough to do that
  // Let's go with Dijkstra's algorithm

  const startPoint = grid.pointAt(0, 0)!;
  const endPoint = grid.pointAt(grid.maxX, grid.maxY)!;
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
