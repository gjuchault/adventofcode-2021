import { Point } from "../helpers/grid";
import { input as input } from "./input";
import {
  computeTrajectory,
  findInitialVelocityXToReachFirstColumn,
  parseTrickShot,
  PointValue,
} from "./trickShot";

async function part1() {
  const { grid, square } = parseTrickShot(input);

  let highestTrajectory: Point<PointValue>[] = [];

  let initialVelocityX = findInitialVelocityXToReachFirstColumn(square);

  // now that we have x, we want to have y as high as possible
  let isInsideWithVelocityY = false;

  // fixme: this max velocity Y is arbritrary
  for (let initialVelocityY = 0; initialVelocityY < 1000; initialVelocityY++) {
    const { trajectory, isInside } = computeTrajectory(
      initialVelocityX,
      initialVelocityY,
      square
    );

    isInsideWithVelocityY = isInside;

    if (isInside) {
      highestTrajectory = trajectory;
    }
  }

  for (const point of highestTrajectory) {
    grid.set(point.x, point.y, "point");
  }

  const highestY = highestTrajectory.reduce((highestY, point) => {
    if (point.y > highestY) {
      return point.y;
    }

    return highestY;
  }, 0);

  return highestY;
}

async function part2() {
  const { square } = parseTrickShot(input);

  let potentialInitialVelocities: [number, number][] = [];

  const minimumViableVelocityX = findInitialVelocityXToReachFirstColumn(square);
  const maximumViableVelocityY = await part1();

  for (
    let targetX = minimumViableVelocityX;
    targetX <= square.bottomRight.x;
    targetX++
  ) {
    for (
      // fixme: not optimized: obviously, only one velocityX can match maximumViableVelocityY,
      // so we're checking way too many velocityY
      let targetY = maximumViableVelocityY;
      targetY >= square.bottomLeft.y;
      targetY--
    ) {
      const trajectory = computeTrajectory(targetX, targetY, square);

      if (trajectory.isInside) {
        potentialInitialVelocities.push([targetX, targetY]);
      }
    }
  }

  return potentialInitialVelocities.length;
}

async function main() {
  console.log(`⭐️ Part 1: ${await part1()}`);
  console.log(`⭐️ Part 2: ${await part2()}`);
}

main();
