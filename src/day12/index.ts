import { buildPassagePathing, CaveWithTail, isCaveSmall } from "./cave";
import { input as rawInput } from "./input";

async function part1() {
  const input = rawInput
    .split("\n")
    .map((line) => line.split("-") as [string, string]);

  const passagePathing = buildPassagePathing(input);

  let startingCave = passagePathing["start"];

  let pathFromStartToEnd: string[][] = [];
  let cavesToExplore: CaveWithTail[] = [];
  // difference with classic bfs: we don't need to keep a global track of all
  // explored caves, each path will be responsible for not exploring the same
  // small cave twice (by checking the tail)

  cavesToExplore.push({ ...startingCave, tail: [] });

  while (cavesToExplore.length > 0) {
    let cave = cavesToExplore.shift()!;

    if (cave.name === "end") {
      pathFromStartToEnd.push([...cave.tail, cave.name]);
      // difference with classic bfs: not stopping the loop here, just
      // continuing to get other paths
      continue;
    }

    for (let sibling of cave.siblings) {
      const siblingCave = passagePathing[sibling];

      if (cave.tail.filter(isCaveSmall).includes(siblingCave.name)) {
        continue;
      }

      cavesToExplore.push({ ...siblingCave, tail: [...cave.tail, cave.name] });
    }
  }

  return pathFromStartToEnd.length;
}

async function part2() {
  const input = rawInput.split("\n").map(Number);

  return input.length;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
