import { input as rawInput } from "./input";

type Command = {
  kind: "forward" | "up" | "down";
  value: number;
};

async function part1() {
  const input = rawInput.split("\n").map(parseCommand);

  let horizontalPosition = 0;
  let depth = 0;

  for (const command of input) {
    switch (command.kind) {
      case "forward": {
        horizontalPosition += command.value;
        break;
      }
      case "down": {
        depth += command.value;
        break;
      }
      case "up": {
        depth -= command.value;
        break;
      }
    }
  }

  return horizontalPosition * depth;
}

async function part2() {
  const input = rawInput.split("\n").map(parseCommand);

  let horizontalPosition = 0;
  let depth = 0;
  let aim = 0;

  for (const command of input) {
    switch (command.kind) {
      case "forward": {
        horizontalPosition += command.value;
        depth += aim * command.value;
        break;
      }
      case "down": {
        aim += command.value;
        break;
      }
      case "up": {
        aim -= command.value;
        break;
      }
    }
  }

  return horizontalPosition * depth;
}

function parseCommand(line: string): Command {
  const [kind, rawValue] = line.split(" ");

  if (!isCommandKind(kind)) {
    throw new Error(`Unknown command: ${kind}`);
  }

  const value = Number(rawValue);

  if (isNaN(value)) {
    throw new Error(`Invalid value: ${rawValue}`);
  }

  return {
    kind: kind as Command["kind"],
    value,
  };
}

function isCommandKind(kind: string): kind is Command["kind"] {
  return ["forward", "up", "down"].includes(kind);
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
