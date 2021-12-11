export type Point<TValue> = { x: number; y: number; value: TValue };

export type Grid<TValue> = {
  set(x: number, y: number, value: TValue): void;
  at(x: number, y: number): TValue | undefined;
  width(): number;
  height(): number;
  toArray(): TValue[][];
  adjacents(x: number, y: number): Point<TValue>[];
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

    at(x: number, y: number): TValue | undefined {
      if (x < 0 || y < 0) {
        return undefined;
      }

      return grid.at(y)?.at(x);
    },

    width() {
      return grid.reduce((width, row) => Math.max(width, row.length), 0);
    },

    height() {
      return grid.length;
    },

    toArray() {
      return [...grid.map((row) => [...row])];
    },

    adjacents(x: number, y: number) {
      return [
        { x: x - 1, y: y, value: this.at(x - 1, y) },
        { x: x + 1, y: y, value: this.at(x + 1, y) },
        { x: x, y: y - 1, value: this.at(x, y - 1) },
        { x: x, y: y + 1, value: this.at(x, y + 1) },
      ].filter((adjacent): adjacent is Point<TValue> => {
        return adjacent.value !== undefined;
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
