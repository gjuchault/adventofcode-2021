import { createGrid, Grid } from "../helpers/grid";

export type Origami = {
  grid: Grid<"#" | ".">;
  folds: Fold[];
};

export type Fold = { direction: "x" | "y"; value: number };

const foldRegex = /fold along (x|y)=(\d+)/;

export function createOrigami(input: string[]) {
  const grid = createGrid<"#" | ".">();
  const folds: Fold[] = [];

  for (const line of input) {
    if (line === "") {
      continue;
    }

    const match = foldRegex.exec(line);

    if (match === null) {
      const [x, y] = line.split(",").map(Number);
      grid.set(x, y, "#");
    } else {
      const [, direction, value] = match;
      if (direction !== "x" && direction !== "y") {
        throw new Error(`Invalid direction: ${direction}`);
      }

      folds.push({ direction: direction, value: Number(value) });
    }
  }

  // we need to fill by point so if we have empty lines we still have them
  for (let x = 0; x < grid.width(); x++) {
    for (let y = 0; y < grid.height(); y++) {
      if (grid.at(x, y) === undefined) {
        grid.set(x, y, ".");
      }
    }
  }

  return {
    grid,
    folds,
  };
}

export function fold(origami: Origami): Origami {
  const grid = createGrid<"#" | ".">();
  const [nextFold, ...folds] = origami.folds;

  const initialHeight = origami.grid.height();
  const initialWidth = origami.grid.width();

  const maxX = nextFold.direction === "x" ? nextFold.value : initialWidth;
  const maxY = nextFold.direction === "y" ? nextFold.value : initialHeight;

  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      grid.set(x, y, ".");

      const pointValue = origami.grid.at(x, y);

      if (pointValue === "#") {
        grid.set(x, y, "#");
      }

      const oppositePoint =
        nextFold.direction === "x"
          ? { x: 2 * nextFold.value - x, y: y }
          : { x: x, y: 2 * nextFold.value - y };

      const oppositePointValue = origami.grid.at(
        oppositePoint.x,
        oppositePoint.y
      );

      if (oppositePointValue === "#") {
        grid.set(x, y, "#");
      }
    }
  }

  return {
    grid,
    folds,
  };
}
