import { input as rawInput } from "./input";

async function part1() {
  const crabs = rawInput.split(",").map(Number);

  let bestPosition = 0;
  let fuelNecessary = Infinity;

  for (
    let targetPosition = 0;
    targetPosition < Math.max(...crabs);
    targetPosition++
  ) {
    const totalFuel = crabs
      .map((crab) => Math.abs(crab - targetPosition))
      .reduce((a, b) => a + b, 0);

    if (totalFuel < fuelNecessary) {
      bestPosition = targetPosition;
      fuelNecessary = totalFuel;
    }
  }

  return fuelNecessary;
}

async function part2() {
  const crabs = rawInput.split(",").map(Number);

  let bestPosition = 0;
  let fuelNecessary = Infinity;

  for (
    let targetPosition = 0;
    targetPosition < Math.max(...crabs);
    targetPosition++
  ) {
    const totalFuel = crabs
      .map((crab) => {
        const distance = Math.abs(crab - targetPosition);

        return (distance * (distance + 1)) / 2;
      })
      .reduce((a, b) => a + b, 0);

    if (totalFuel < fuelNecessary) {
      bestPosition = targetPosition;
      fuelNecessary = totalFuel;
    }
  }

  return fuelNecessary;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
