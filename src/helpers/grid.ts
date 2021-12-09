export function createGrid<TValue>() {
  let grid: TValue[][] = [];

  return {
    set(x: number, y: number, value: TValue) {
      grid[y] = grid[y] ?? [];
      grid[y][x] = value;
    },

    at(x: number, y: number): TValue | undefined {
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
