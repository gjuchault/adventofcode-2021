import { input as rawInput } from "./input";
import { decodePacket } from "./bits";
import { hexToBin } from "../helpers/char";

async function part1() {
  const input = rawInput.split("").map(hexToBin).join("");
  const packet = decodePacket(input);

  let sumOfVersions = 0;

  let queue = [packet];
  while (queue.length > 0) {
    const packet = queue.pop()!;

    sumOfVersions += packet.version;

    if (packet.type === "literalValue") {
      continue;
    }

    queue.push(...packet.subPackets);
  }

  return sumOfVersions;
}

async function part2() {
  return rawInput.length;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
