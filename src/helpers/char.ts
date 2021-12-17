export function hexToBin(input: string) {
  if (!/^[\dA-F]$/i.test(input)) {
    throw new Error(`Unknown hexadecimal character: ${input}`);
  }

  return parseInt(input.toString(), 16).toString(2).padStart(4, "0");
}
