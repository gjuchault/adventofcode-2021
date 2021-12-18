import {
  createGrid,
  Grid,
  Square,
  Point,
  doesSquareContainPoint,
} from "../helpers/grid";

const parseRegex =
  /target area: x=([-\d]\d*)\.\.([-\d]\d*), y=([-\d]\d*)\.\.([-\d]\d*)/;

export type PointValue = "start" | "area" | "point";

export function parseTrickShot(input: string): {
  grid: Grid<PointValue>;
  square: Square<PointValue>;
} {
  const match = input.match(parseRegex);

  if (match === null) {
    throw new Error("Could not parse input");
  }

  const [_, x1, x2, y1, y2] = match;
  const grid = createGrid<PointValue>();

  for (let x = Number(x1); x <= Number(x2); x++) {
    for (let y = Number(y1); y <= Number(y2); y++) {
      grid.set(x, y, "area");
    }
  }

  grid.set(0, 0, "start");

  return {
    grid,
    square: {
      topLeft: { x: Number(x1), y: Number(y2), value: "area" },
      topRight: { x: Number(x2), y: Number(y2), value: "area" },
      bottomRight: { x: Number(x2), y: Number(y1), value: "area" },
      bottomLeft: { x: Number(x1), y: Number(y1), value: "area" },
    },
  };
}

export function computeTrajectory(
  initialVelocityX: number,
  initialVelocityY: number,
  square: Square<PointValue>
): { trajectory: Point<PointValue>[]; isInside: boolean } {
  const trajectory: Point<PointValue>[] = [];

  let velocityX = initialVelocityX;
  let velocityY = initialVelocityY;
  let currentPoint: Point<PointValue> = { x: 0, y: 0, value: "start" };

  while (true) {
    trajectory.push(currentPoint);

    if (doesSquareContainPoint(square, currentPoint)) {
      return { trajectory, isInside: true };
    }

    if (currentPoint.y < square.bottomLeft.y) {
      return { trajectory, isInside: false };
    }

    currentPoint = {
      x: currentPoint.x + velocityX,
      y: currentPoint.y + velocityY,
      value: "point",
    };

    if (velocityX > 0) {
      velocityX -= 1;
    } else if (velocityX < 0) {
      velocityX += 1;
    }

    velocityY -= 1;
  }
}

export function findInitialVelocityXToReachFirstColumn(
  square: Square<PointValue>
) {
  for (
    let targetX = square.bottomLeft.x;
    targetX < square.bottomRight.x;
    targetX++
  ) {
    // let ivx = intial velocity x for the probe launch
    // we know max x = ivx + (ivx - 1) + ... = ivx * (ivx + 1) / 2
    // we want this to be as close as possible to left edge of square
    // so quadratic equation for each x starting from edge

    // quadratic equation with a = 0.5, b = 0.5, c = -1 * targetX
    // delta = (0.5)^2 - 4 * 0.5 * (-1 * targetX);
    const delta = 0.25 + 2 * targetX;
    // we ignore the negative solution, since the square is always after (0,0)
    const velocityToReachTargetX = -0.5 + Math.sqrt(delta);

    if (Number.isInteger(velocityToReachTargetX)) {
      return velocityToReachTargetX;
    }
  }

  return 0;
}
