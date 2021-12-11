import { input as rawInput } from "./input";
import { createGrid, Grid, isSamePoint, Point } from "../helpers/grid";

async function part1() {
  const input = rawInput.split("\n").map((line) => line.split("").map(Number));

  const grid = createGrid<number>();
  grid.fromArray(input);

  return getLowPointsCoordinates(grid).reduce((acc, { x, y }) => {
    return acc + grid.at(x, y)! + 1;
  }, 0);
}

async function part2() {
  const input = rawInput.split("\n").map((line) => line.split("").map(Number));

  const grid = createGrid<number>();
  grid.fromArray(input);

  const lowPoints = getLowPointsCoordinates(grid);

  const topThreeBassins = [0, 0, 0];

  for (const lowPointCoordinates of lowPoints) {
    let bassinScore = 1;

    const lowPoint = {
      ...lowPointCoordinates,
      value: grid.at(lowPointCoordinates.x, lowPointCoordinates.y)!,
    };

    let points = grid.adjacents(lowPoint.x, lowPoint.y);

    let pointsAlreadyExplored: Point<number>[] = [lowPoint];

    while (points.length > 0) {
      let point = points.shift()!;

      if (
        pointsAlreadyExplored.some((pointAlreadyExplored) =>
          isSamePoint(pointAlreadyExplored, point)
        )
      ) {
        continue;
      }

      pointsAlreadyExplored.push(point);

      if (point.value === 9) {
        continue;
      }

      bassinScore += 1;

      const nextCandidates = grid
        .adjacents(point.x, point.y)
        .filter((nextCandidate) => {
          const hasAlreadyExplored = pointsAlreadyExplored.find(
            (pointAlreadyExplored) => {
              return isSamePoint(nextCandidate, pointAlreadyExplored);
            }
          );

          if (!hasAlreadyExplored) {
            return true;
          }
        });

      points.push(...nextCandidates);
    }

    if (bassinScore > topThreeBassins[0] && bassinScore < topThreeBassins[1]) {
      topThreeBassins[0] = bassinScore;
    } else if (
      bassinScore > topThreeBassins[1] &&
      bassinScore < topThreeBassins[2]
    ) {
      topThreeBassins[0] = topThreeBassins[1];
      topThreeBassins[1] = bassinScore;
    } else if (bassinScore > topThreeBassins[0]) {
      topThreeBassins[0] = topThreeBassins[1];
      topThreeBassins[1] = topThreeBassins[2];
      topThreeBassins[2] = bassinScore;
    }
  }

  return topThreeBassins.reduce((acc, value) => acc * value, 1);
}

function getLowPointsCoordinates(grid: Grid<number>) {
  const lowPoints: { x: number; y: number }[] = [];

  for (let x = 0; x < grid.width(); x++) {
    for (let y = 0; y < grid.height(); y++) {
      const cell = grid.at(x, y);

      if (cell === undefined) {
        throw new Error("Cell is undefined");
      }

      const adjacents = grid.adjacents(x, y);

      const isLowPoint = adjacents.every((adjacent) => adjacent.value > cell);

      if (isLowPoint) {
        lowPoints.push({ x, y });
      }
    }
  }

  return lowPoints;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
