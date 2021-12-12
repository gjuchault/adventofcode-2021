export type Cave = {
  name: string;
  type: "small" | "big";
  siblings: string[];
};

export type CaveWithTail = Cave & {
  tail: string[];
};

export function buildPassagePathing(allLinks: [string, string][]) {
  const caveByName: Record<string, Cave> = {};

  for (const [left, right] of allLinks) {
    caveByName[left] = caveByName[left] ?? {
      name: left,
      type: isCaveSmall(left) ? "small" : "big",
      siblings: [],
    };

    caveByName[right] = caveByName[right] ?? {
      name: right,
      type: isCaveSmall(right) ? "small" : "big",
      siblings: [],
    };

    caveByName[left].siblings.push(right);
    caveByName[right].siblings.push(left);
  }

  return caveByName;
}

export function isCaveSmall(name: string) {
  return name[0].toLowerCase() === name[0];
}
