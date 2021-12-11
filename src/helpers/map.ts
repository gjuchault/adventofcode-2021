export function reverseMap<K, V, NewV = V>(
  input: Map<K, V>,
  valueIterator: (value: V) => NewV = (value) => value as unknown as NewV
): Map<NewV, K> {
  const output = new Map<NewV, K>();

  for (const [key, value] of input) {
    output.set(valueIterator(value), key);
  }

  return output;
}
