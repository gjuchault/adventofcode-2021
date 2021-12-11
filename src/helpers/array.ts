export function transpose<T>(input: T[][]): T[][] {
  return input[0].map((_, c) => input.map((r) => r[c]));
}

export function intersection<T>(left: T[], right: T[]): T[] {
  return left.filter((item) => right.includes(item));
}

export function filterOutUndefined<T>(item: T | undefined): item is T {
  return item !== undefined;
}
