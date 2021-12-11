import { filterOutUndefined } from "./array";

export function createGrid<TValue>() {
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
        this.at(x - 1, y),
        this.at(x + 1, y),
        this.at(x, y - 1),
        this.at(x, y + 1),
      ].filter(filterOutUndefined);
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
