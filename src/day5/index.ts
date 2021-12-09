import { createGrid } from "../helpers/grid";
import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput.split("\n").map((line) => {
    const m = line.match(lineRegexp);

    if (!m) {
      throw new Error(`Invalid line: ${line}`);
    }

    return m.slice(1).map(Number);
  });

  let part1 = 0;
  const grid = createGrid<number>();

  for (const line of input) {
    const [x1, y1, x2, y2] = line;

    if (x1 === x2) {
      const x = x1;
      const min = Math.min(y1, y2);
      const max = Math.max(y1, y2);

      for (let y = min; y <= max; y++) {
        const current = grid.at(x, y) ?? 0;
        grid.set(x, y, current + 1);

        if (current === 1) {
          part1++;
        }
      }
    }

    if (y1 === y2) {
      const y = y1;
      const min = Math.min(x1, x2);
      const max = Math.max(x1, x2);

      for (let x = min; x <= max; x++) {
        const current = grid.at(x, y) ?? 0;
        grid.set(x, y, current + 1);

        if (current === 1) {
          part1++;
        }
      }
    }
  }

  return part1;
}

async function part2() {
  const input = rawInput.split("\n").map((line) => {
    const m = line.match(lineRegexp);

    if (!m) {
      throw new Error(`Invalid line: ${line}`);
    }

    return m.slice(1).map(Number);
  });

  let part2 = 0;
  const grid = createGrid<number>();

  for (const line of input) {
    const [x1, y1, x2, y2] = line;

    if (x1 === x2) {
      const x = x1;
      const min = Math.min(y1, y2);
      const max = Math.max(y1, y2);

      for (let y = min; y <= max; y++) {
        const current = grid.at(x, y) ?? 0;
        grid.set(x, y, current + 1);

        if (current === 1) {
          part2++;
        }
      }
    } else if (y1 === y2) {
      const y = y1;
      const min = Math.min(x1, x2);
      const max = Math.max(x1, x2);

      for (let x = min; x <= max; x++) {
        const current = grid.at(x, y) ?? 0;
        grid.set(x, y, current + 1);

        if (current === 1) {
          part2++;
        }
      }
    } else {
      if (x2 > x1 && y2 > y1) {
        for (let i = 0; i <= x2 - x1; i++) {
          const x = x1 + i;
          const y = y1 + i;

          const current = grid.at(x, y) ?? 0;
          grid.set(x, y, current + 1);

          if (current === 1) {
            part2++;
          }
        }
      } else if (x2 < x1 && y2 > y1) {
        for (let i = 0; i <= x1 - x2; i++) {
          const x = x1 - i;
          const y = y1 + i;

          const current = grid.at(x, y) ?? 0;
          grid.set(x, y, current + 1);

          if (current === 1) {
            part2++;
          }
        }
      } else if (x2 > x1 && y2 < y1) {
        for (let i = 0; i <= x2 - x1; i++) {
          const x = x1 + i;
          const y = y1 - i;

          const current = grid.at(x, y) ?? 0;
          grid.set(x, y, current + 1);

          if (current === 1) {
            part2++;
          }
        }
      } else {
        for (let i = 0; i <= x1 - x2; i++) {
          const x = x1 - i;
          const y = y1 - i;

          const current = grid.at(x, y) ?? 0;
          grid.set(x, y, current + 1);

          if (current === 1) {
            part2++;
          }
        }
      }
    }
  }

  return part2;
}

const lineRegexp = /^(\d+),(\d+) -> (\d+),(\d+)$/;

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
