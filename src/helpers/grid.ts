export type Point<TValue> = { x: number; y: number; value: TValue };

export type Grid<TValue> = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  set(x: number, y: number, value: TValue): void;
  setFn(x: number, y: number, fn: (value: TValue | undefined) => TValue): void;
  at(x: number, y: number): TValue | undefined;
  pointAt(x: number, y: number): Point<TValue> | undefined;
  adjacents(x: number, y: number, includeDiagonals?: boolean): Point<TValue>[];
  allPoints(): Point<TValue>[];
  fromArray(input: TValue[][]): void;
  display(defaultValue?: string): string;
};

export function createGrid<TValue>(): Grid<TValue> {
  let grid: Map<string, TValue> = new Map();

  return {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,

    set(x: number, y: number, value: TValue) {
      if (x < this.minX) {
        this.minX = x;
      }

      if (x > this.maxX) {
        this.maxX = x;
      }

      if (y < this.minY) {
        this.minY = y;
      }

      if (y > this.maxY) {
        this.maxY = y;
      }

      grid.set(encodeCoordinates({ x, y }), value);
    },

    setFn(x: number, y: number, fn: (value: TValue | undefined) => TValue) {
      const id = encodeCoordinates({ x, y });
      grid.set(id, fn(grid.get(id)));
    },

    at(x: number, y: number): TValue | undefined {
      return grid.get(encodeCoordinates({ x, y }));
    },

    pointAt(x: number, y: number): Point<TValue> | undefined {
      const value = this.at(x, y);

      if (value === undefined) {
        return undefined;
      }

      return { x, y, value };
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
      const allPoints: Point<TValue>[] = [];

      for (const [encodedCoordinates, value] of grid) {
        allPoints.push({
          ...decodeCoordinates(encodedCoordinates),
          value,
        });
      }

      return allPoints;
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
      for (let y = 0; y <= this.maxY; y++) {
        let row = "";
        for (let x = 0; x <= this.maxX; x++) {
          row += this.at(x, y) ?? defaultValue;
        }

        rows.push(row);
      }

      return rows.join("\n");
    },
  };
}

export function encodeCoordinates({ x, y }: { x: number; y: number }) {
  return `${x},${y}`;
}

export function decodeCoordinates(id: string): { x: number; y: number } {
  const [x, y] = id.split(",").map(Number);

  if (Number.isNaN(x) || Number.isNaN(y)) {
    throw new Error(`Invalid point id: ${id}`);
  }

  return { x, y };
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
