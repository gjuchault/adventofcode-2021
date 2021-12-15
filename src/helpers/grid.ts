export type Point<TValue> = { x: number; y: number; value: TValue };

export type Grid<TValue> = {
  set(x: number, y: number, value: TValue): void;
  setFn(x: number, y: number, fn: (value: TValue) => TValue): void;
  at(x: number, y: number): TValue | undefined;
  pointAt(x: number, y: number): Point<TValue> | undefined;
  width(): number;
  height(): number;
  toArray(): readonly (readonly TValue[])[];
  adjacents(x: number, y: number, includeDiagonals?: boolean): Point<TValue>[];
  allPoints(): Point<TValue>[];
  fromArray(input: TValue[][]): void;
  display(defaultValue?: string): string;
};

export function createGrid<TValue>(): Grid<TValue> {
  let grid: TValue[][] = [];

  return {
    set(x: number, y: number, value: TValue) {
      grid[y] = grid[y] ?? [];
      grid[y][x] = value;
    },

    setFn(x: number, y: number, fn: (value: TValue) => TValue) {
      grid[y] = grid[y] ?? [];
      grid[y][x] = fn(grid[y][x]);
    },

    at(x: number, y: number): TValue | undefined {
      if (x < 0 || y < 0) {
        return undefined;
      }

      return grid.at(y)?.at(x);
    },

    pointAt(x: number, y: number): Point<TValue> | undefined {
      const value = this.at(x, y);

      if (value === undefined) {
        return undefined;
      }

      return { x, y, value };
    },

    width() {
      return grid.reduce((width, row) => Math.max(width, row.length), 0);
    },

    height() {
      return grid.length;
    },

    toArray() {
      return Object.freeze(grid.map((row) => Object.freeze(row)));
    },

    adjacents(x: number, y: number, includeDiagonals = false) {
      return [
        { x: x - 1, y: y, value: this.at(x - 1, y) },
        { x: x + 1, y: y, value: this.at(x + 1, y) },
        { x: x, y: y - 1, value: this.at(x, y - 1) },
        { x: x, y: y + 1, value: this.at(x, y + 1) },
        includeDiagonals
          ? { x: x + 1, y: y + 1, value: this.at(x + 1, y + 1) }
          : undefined,
        includeDiagonals
          ? { x: x - 1, y: y + 1, value: this.at(x - 1, y + 1) }
          : undefined,
        includeDiagonals
          ? { x: x + 1, y: y - 1, value: this.at(x + 1, y - 1) }
          : undefined,
        includeDiagonals
          ? { x: x - 1, y: y - 1, value: this.at(x - 1, y - 1) }
          : undefined,
      ].filter((adjacent): adjacent is Point<TValue> => {
        return adjacent?.value !== undefined;
      });
    },

    allPoints() {
      return this.toArray().flatMap((row, y) => {
        return row.map((value, x) => ({ x, y, value }));
      });
    },

    fromArray(input: TValue[][]) {
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
          this.set(x, y, input[y][x]);
        }
      }
    },

    display(defaultValue: string = ".") {
      let rows = [];
      for (let y = 0; y < this.height(); y++) {
        let row = "";
        for (let x = 0; x < this.width(); x++) {
          row += this.at(x, y) ?? defaultValue;
        }

        rows.push(row);
      }

      return rows.join("\n");
    },
  };
}

export function isSamePoint<TValue>(left: Point<TValue>, right: Point<TValue>) {
  return left.x === right.x && left.y === right.y;
}

export function uniquePoints<TValue>(points: Point<TValue>[]) {
  const idMap: Map<string, TValue> = new Map();

  for (const point of points) {
    idMap.set(point.x + "," + point.y, point.value);
  }

  const uniquePoints: Point<TValue>[] = [];

  for (const [key, value] of idMap) {
    const [x, y] = key.split(",").map(Number);

    uniquePoints.push({ x, y, value });
  }

  return uniquePoints;
}

export function doesPathContainsPoint<TValue>(
  path: Point<TValue>[],
  point: Point<TValue>
) {
  let found = false;

  for (const pathPoint of path) {
    if (isSamePoint(pathPoint, point)) {
      found = true;
      break;
    }
  }

  return found;
}
