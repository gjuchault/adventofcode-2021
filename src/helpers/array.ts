export function transpose<T>(input: T[][]): T[][] {
  return input[0].map((_, c) => input.map((r) => r[c]));
}
